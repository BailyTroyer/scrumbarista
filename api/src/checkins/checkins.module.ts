import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Day } from "src/standups/entities/day.entity";
import { StandupsModule } from "src/standups/standups.module";

import { CheckinsController } from "./checkins.controller";
import { CheckinsService } from "./checkins.service";
import { Checkin } from "./entities/checkin.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Checkin, Day]), StandupsModule],
  controllers: [CheckinsController],
  providers: [CheckinsService],
  exports: [CheckinsService],
})
export class CheckinsModule {}
