import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CheckinsModule } from "./checkins/checkins.module";
import { HealthModule } from "./health/health.module";
import ormConfig from "./ormconfig";
import { StandupsModule } from "./standups/standups.module";

@Module({
  imports: [
    TypeOrmModule.forRoot(ormConfig),
    HealthModule,
    StandupsModule,
    CheckinsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
