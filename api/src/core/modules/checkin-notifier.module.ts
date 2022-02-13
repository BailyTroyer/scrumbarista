import { Injectable, Module } from "@nestjs/common";

import { SlackModule } from "src/slack/slack.module";
import { SlackService } from "src/slack/slack.service";
import { Standup } from "src/standups/entities/standup.entity";

import { CheckinsModule } from "../../checkins/checkins.module";
import { CheckinsService } from "../../checkins/checkins.service";
import { TimeUtilsModule, TimeUtilsService } from "./../utils/time";

type StandupAndUsers = Standup & {
  users: {
    name: string;
    id: string;
    image: string;
  }[];
  channelName: string;
};

@Injectable()
export class CheckinNotifierService {
  constructor(
    private readonly checkinsService: CheckinsService,
    private readonly timeUtils: TimeUtilsService,
    private readonly slackService: SlackService
  ) {}

  private async pingUserStandup(
    standup: StandupAndUsers,
    userId: string
  ): Promise<void> {
    const questions = standup.questions.filter((q) => q !== "");

    // Get user's timezone (or channel if undefined)
    const timezone =
      standup.timezoneOverrides.find((override) => override.userId === userId)
        ?.timezone || standup.timezone;

    const offsetDate = this.timeUtils.dateTimezoneOffset(
      this.timeUtils.getTimezoneOffset(timezone)
    );

    const dayName = this.timeUtils.getDayName(offsetDate).toLowerCase();

    const standupIsToday = standup.days
      .map((d) => d.day.toString())
      .includes(dayName);
    const standupTimeIsNow =
      this.timeUtils.totalSeconds(standup.startTime) <=
      this.timeUtils.totalSeconds(this.timeUtils.toMilitaryTime(offsetDate));

    if (!(standupTimeIsNow && standupIsToday)) return;

    // Check if this is the standup day, and it has been past the standup time for their timezone
    const checkins = (
      await this.checkinsService.findAll(standup.channelId, {
        users: { users: [userId] },
        createdDate: offsetDate.toLocaleDateString(),
      })
    )
      // since the standups are stored in UTC we filter out dates that weren't same day as today relative
      // i.e. if last standup was 9p 2/11 (that's actually 2a 2/12 which is false positive)
      .filter(
        (c) =>
          this.timeUtils
            .tzOffset(this.timeUtils.getTimezoneOffset(timezone), c.createdDate)
            .toLocaleDateString() === offsetDate.toLocaleDateString()
      );

    // if user already completed/started checkin
    if (checkins.length === 0) {
      // send reminder message & create empty checkin for later completion
      const checkin = { answers: [], postMessageTs: "", userId: userId };
      await this.checkinsService.create(standup.channelId, checkin);
      await this.slackService.postMessage({
        channel: userId,
        text: `The *${standup.name}* is about to start.`,
      });

      await this.slackService.postMessage({
        channel: userId,
        text: questions[0],
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: questions[0],
            },
            accessory: {
              type: "static_select",
              placeholder: {
                type: "plain_text",
                text: "Quick Action",
                emoji: true,
              },
              options: [{ text: "I'm OOO today", value: "ooo" }].map(
                ({ text, value }) => ({
                  text: {
                    type: "plain_text",
                    text,
                  },
                  value,
                })
              ),
              action_id: "checkinMessageDmQuickResponse",
            },
          },
        ],
      });
    }
  }

  public async pingUsersForCheckin(standup: StandupAndUsers): Promise<void> {
    // Ping all users that don't have overrides

    const overrides = standup.timezoneOverrides.map((o) => o.userId);

    for (const user of standup.users.filter((u) => !overrides.includes(u.id))) {
      await this.pingUserStandup(standup, user.id);
    }
  }

  public async pingUserForCheckin(
    standup: StandupAndUsers,
    userId: string
  ): Promise<void> {
    return this.pingUserStandup(standup, userId);
  }
}

@Module({
  imports: [SlackModule, CheckinsModule, TimeUtilsModule],
  providers: [CheckinNotifierService],
  exports: [CheckinNotifierService],
})
export class CheckinNotifierModule {}
