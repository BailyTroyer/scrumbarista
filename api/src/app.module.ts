import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CheckinsModule } from "./checkins/checkins.module";
import { HealthModule } from "./health/health.module";
import { NotificationsModule } from "./notifications/notifications.module";
import ormConfig from "./ormconfig";
import { SlackModule } from "./slack/slack.module";
import { StandupsModule } from "./standups/standups.module";

@Module({
  imports: [
    TypeOrmModule.forRoot({ ...ormConfig, keepConnectionAlive: true }),
    ScheduleModule.forRoot(),
    HealthModule,
    StandupsModule,
    CheckinsModule,
    NotificationsModule,
    SlackModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
