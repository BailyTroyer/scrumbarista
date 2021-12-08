import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CheckinsModule } from "./checkins/checkins.module";
import { Checkin } from "./checkins/entities/checkin.entity";
import { HealthModule } from "./health/health.module";
import { Standup } from "./standups/entities/standup.entity";
import { StandupsModule } from "./standups/standups.module";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      entities: [Standup, Checkin],
      type: "mysql",
      host: process.env.DB,
      port: 3306,
      username: "username",
      password: "password",
      database: "scrumbarista",
      keepConnectionAlive: true,
      synchronize: true,
    }),
    HealthModule,
    StandupsModule,
    CheckinsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
