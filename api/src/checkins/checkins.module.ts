import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { StandupsModule } from "../standups/standups.module";
import { CheckinsController } from "./checkins.controller";
import { CheckinsService } from "./checkins.service";
import { Checkin } from "./entities/checkin.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Checkin]), StandupsModule],
  controllers: [CheckinsController],
  providers: [CheckinsService],
})
export class CheckinsModule {}
