import { Inject, Injectable, Module } from "@nestjs/common";
import { SchedulerRegistry } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";
import { WebClient } from "@slack/web-api";
import { Repository } from "typeorm";

import { CheckinsModule } from "../../checkins/checkins.module";
import { CheckinsService } from "../../checkins/checkins.service";
import { Standup } from "../../standups/entities/standup.entity";
import { StandupsModule } from "../../standups/standups.module";
import { StandupsService } from "../../standups/standups.service";
import { BoltModule } from "./bolt.module";

@Injectable()
export class CheckinNotifierService {
  constructor(
    @InjectRepository(Notification)
    private notificationsRepository: Repository<Notification>,
    private schedulerRegistry: SchedulerRegistry,
    @Inject("BOLT") private bolt: WebClient,
    private readonly standupsService: StandupsService,
    private readonly checkinsService: CheckinsService
  ) {}

  async pingUsersForCheckin() {
    const date = new Date();
    const localDateString = date.toLocaleDateString();
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const dayName = days[date.getDay()];

    const standups = await this.standupsService.findAll({ day: dayName });

    standups?.forEach(
      async ({ channelId: channel, name, ...standup }: Standup) => {
        const questions = standup.questions.filter((q) => q !== "");

        // fetch all users in channel
        const users = await this.bolt.conversations.members({
          channel,
        });

        users.members.forEach(async (user: string) => {
          const checkins = await this.checkinsService.findAll(channel, {
            users: { users: [user] },
            createdDate: localDateString,
          });

          // if user already completed/started checkin
          if (checkins.length === 0) {
            // send reminder message & create empty checkin for later completion
            const checkin = { answers: [], postMessageTs: "", userId: user };
            await this.checkinsService.create(channel, checkin);

            await this.bolt.chat.postMessage({
              channel: user,
              text: `The *${name}* is about to start.`,
            });
            await this.bolt.chat.postMessage({
              channel: user,
              text: questions[0],
            });
          }
        });
      }
    );
  }
}

@Module({
  imports: [BoltModule, StandupsModule, CheckinsModule],
  providers: [CheckinNotifierService],
  exports: [CheckinNotifierService],
})
export class CheckinNotifierModule {}
