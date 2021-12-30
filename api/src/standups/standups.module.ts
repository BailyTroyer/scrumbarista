import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { BoltModule } from "../modules/bolt.module";
import { Day } from "./entities/day.entity";
import { Standup } from "./entities/standup.entity";
import { StandupsController } from "./standups.controller";
import { StandupsService } from "./standups.service";

@Module({
  imports: [TypeOrmModule.forFeature([Standup, Day]), BoltModule],
  controllers: [StandupsController],
  providers: [StandupsService],
  exports: [StandupsService],
})
export class StandupsModule {}
