import { Injectable, Module } from "@nestjs/common";
import {
  Middleware,
  SlackCommandMiddlewareArgs,
  SectionBlock,
} from "@slack/bolt";

import { StandupsModule } from "src/standups/standups.module";
import { StandupsService } from "src/standups/standups.service";

import { CheckinsModule } from "../../checkins/checkins.module";
import { CheckinsService } from "../../checkins/checkins.service";

export const sectionBlock = (text: string): SectionBlock => ({
  type: "section",
  text: {
    type: "mrkdwn",
    text,
  },
});

@Injectable()
export class SlackBoltService {
  constructor(
    private readonly standupService: StandupsService,
    private readonly checkinsService: CheckinsService
  ) {}

  scrumbaristaCommand: Middleware<SlackCommandMiddlewareArgs> = async (
    args
  ) => {
    const {
      ack,
      command: { channel_id: channel, user_id: user },
      client,
    } = args;

    void ack();
    await client.chat.postEphemeral({
      channel,
      attachments: [
        {
          color: "#2E68EC",
          blocks: [
            sectionBlock(
              '*Scrumbarista*\ninvoked with "/scrumbarista"\n"randomPerson" and "randomOrder" arguments for picking random groups'
            ),
          ],
        },
        {
          color: "#ECB22E",
          blocks: [
            sectionBlock(
              '*Manage*\ninvoked with "/standup"\nOpens a dialog to manage a stand up'
            ),
          ],
        },
        {
          color: "#41BC88",
          blocks: [
            sectionBlock(
              '*Checkin*\ninvoked with "/checkin"\nOpens a dialog to checkin and fulfull the daily stand up. Otherwise you will get a message in your DM at the alloted time'
            ),
          ],
        },
      ],
      user,
    });
  };
}

@Module({
  imports: [CheckinsModule, StandupsModule],
  providers: [SlackBoltService],
  exports: [SlackBoltService],
})
export class SlackBoltModule {}
