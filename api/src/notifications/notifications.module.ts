import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Standup } from "src/standups/entities/standup.entity";

import { BoltModule } from "../core/modules/bolt.module";
import { CheckinNotifierModule } from "../core/modules/checkin-notifier.module";
import { StandupNotification } from "./entities/notification.entity";
import { NotificationsController } from "./notifications.controller";
import { NotificationsService } from "./notifications.service";

@Module({
  imports: [
    BoltModule,
    TypeOrmModule.forFeature([StandupNotification, Standup]),
    CheckinNotifierModule,
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
