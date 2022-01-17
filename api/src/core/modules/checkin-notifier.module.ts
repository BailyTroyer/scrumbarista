import { Inject, Injectable, Module } from "@nestjs/common";
import { WebClient } from "@slack/web-api";

import { Standup } from "src/standups/entities/standup.entity";

import { CheckinsModule } from "../../checkins/checkins.module";
import { CheckinsService } from "../../checkins/checkins.service";
import { TimeUtilsModule, TimeUtilsService } from "./../utils/time";
import { BoltModule } from "./bolt.module";

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
    @Inject("BOLT") private bolt: WebClient,
    private readonly checkinsService: CheckinsService,
    private readonly timeUtils: TimeUtilsService
  ) {}

  private async pingUserStandup(
    standup: StandupAndUsers,
    userId: string
  ): Promise<void> {
    const questions = standup.questions.filter((q) => q !== "");

    // Get user's timezone
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

    console.log(
      `startTime=${standup.startTime};time=${this.timeUtils.toMilitaryTime(
        offsetDate
      )}`
    );

    console.log(
      `standupTimeIsNow=${standupTimeIsNow};standupIsToday=${standupIsToday}`
    );
    if (!(standupTimeIsNow && standupIsToday)) return;

    // Check if this is the standup day, and it has been past the standup time for their timezone

    const checkins = await this.checkinsService.findAll(standup.channelId, {
      users: { users: [userId] },
      // @Todo should we look for standups in our time or their timezone
      createdDate: new Date().toLocaleDateString(),
    });

    // if user already completed/started checkin
    if (checkins.length === 0) {
      // send reminder message & create empty checkin for later completion
      const checkin = { answers: [], postMessageTs: "", userId: userId };
      await this.checkinsService.create(standup.channelId, checkin);

      await this.bolt.chat.postMessage({
        channel: userId,
        text: `The *${standup.name}* is about to start.`,
      });
      await this.bolt.chat.postMessage({
        channel: userId,
        text: questions[0],
      });
    }
  }

  public async pingUsersForCheckin(standup: StandupAndUsers): Promise<void> {
    for (const user of standup.users) {
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
  imports: [BoltModule, CheckinsModule, TimeUtilsModule],
  providers: [CheckinNotifierService],
  exports: [CheckinNotifierService],
})
export class CheckinNotifierModule {}
