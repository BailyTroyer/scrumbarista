import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConnectionOptions } from "typeorm";

import { CheckinsModule } from "./checkins/checkins.module";
import { validate } from "./core/config/config.validation";
import databaseConfig from "./core/config/database.config";
import configuration from "./core/config/main.config";
import { SlackBoltModule } from "./core/modules/slack.module";
import { HealthModule } from "./health/health.module";
import { NotificationsModule } from "./notifications/notifications.module";
import { SlackModule } from "./slack/slack.module";
import { StandupsModule } from "./standups/standups.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env.development.local", ".env.development"],
      load: [configuration, databaseConfig],
      validate,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get("database"),
    }),
    ScheduleModule.forRoot(),
    HealthModule,
    StandupsModule,
    CheckinsModule,
    NotificationsModule,
    SlackModule,
    SlackBoltModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
