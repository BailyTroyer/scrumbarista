import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { BoltModule } from "src/core/modules/bolt.module";
import { TimeUtilsModule } from "src/core/utils/time";
import { NotificationsModule } from "src/notifications/notifications.module";

import { Day } from "./entities/day.entity";
import { Standup } from "./entities/standup.entity";
import { TimezoneOverride } from "./entities/tzoverride.entity";
import { StandupsController } from "./standups.controller";
import { StandupsService } from "./standups.service";

@Module({
  imports: [
    BoltModule,
    TypeOrmModule.forFeature([Standup, Day, TimezoneOverride]),
    TimeUtilsModule,
    NotificationsModule,
  ],
  controllers: [StandupsController],
  providers: [StandupsService],
  exports: [StandupsService],
})
export class StandupsModule {}
