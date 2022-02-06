import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { TimeUtilsModule } from "src/core/utils/time";
import { UserStandupNotification } from "src/notifications/entities/notification.entity";
import { NotificationsModule } from "src/notifications/notifications.module";
import { SlackModule } from "src/slack/slack.module";

import { Day } from "./entities/day.entity";
import { Standup } from "./entities/standup.entity";
import { TimezoneOverride } from "./entities/tzoverride.entity";
import { StandupsController } from "./standups.controller";
import { StandupsService } from "./standups.service";

@Module({
  imports: [
    SlackModule,
    NotificationsModule,
    TypeOrmModule.forFeature([
      Standup,
      Day,
      TimezoneOverride,
      UserStandupNotification,
    ]),
    TimeUtilsModule,
  ],
  controllers: [StandupsController],
  providers: [StandupsService],
  exports: [StandupsService],
})
export class StandupsModule {}
