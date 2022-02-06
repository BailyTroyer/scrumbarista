import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { SlackModule } from "src/slack/slack.module";
import { Standup } from "src/standups/entities/standup.entity";

import { CheckinNotifierModule } from "../core/modules/checkin-notifier.module";
import {
  StandupNotification,
  UserStandupNotification,
} from "./entities/notification.entity";
import { NotificationsController } from "./notifications.controller";
import { NotificationsService } from "./notifications.service";

@Module({
  imports: [
    SlackModule,
    TypeOrmModule.forFeature([
      StandupNotification,
      UserStandupNotification,
      Standup,
    ]),
    CheckinNotifierModule,
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
