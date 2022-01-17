import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Standup } from "src/standups/entities/standup.entity";

import { Day } from "../standups/entities/day.entity";
import { CheckinsController } from "./checkins.controller";
import { CheckinsService } from "./checkins.service";
import { Checkin } from "./entities/checkin.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Checkin, Day, Standup])],
  controllers: [CheckinsController],
  providers: [CheckinsService],
  exports: [CheckinsService],
})
export class CheckinsModule {}
