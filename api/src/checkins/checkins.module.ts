import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Day } from "../standups/entities/day.entity";
import { StandupsModule } from "../standups/standups.module";
import { CheckinsController } from "./checkins.controller";
import { CheckinsService } from "./checkins.service";
import { Checkin } from "./entities/checkin.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Checkin, Day]), StandupsModule],
  controllers: [CheckinsController],
  providers: [CheckinsService],
})
export class CheckinsModule {}
