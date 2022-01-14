import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { BoltModule } from "../core/modules/bolt.module";
import { Day } from "./entities/day.entity";
import { Standup } from "./entities/standup.entity";
import { TimezoneOverride } from "./entities/tzoverride.entity";
import { StandupsController } from "./standups.controller";
import { StandupsService } from "./standups.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Standup, Day, TimezoneOverride]),
    BoltModule,
  ],
  controllers: [StandupsController],
  providers: [StandupsService],
  exports: [StandupsService],
})
export class StandupsModule {}
