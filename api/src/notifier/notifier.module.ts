import { Module } from "@nestjs/common";

import { BoltModule } from "../core/modules/bolt.module";
import { NotifierController } from "./notifier.controller";
import { NotifierService } from "./notifier.service";

@Module({
  imports: [BoltModule],
  controllers: [NotifierController],
  providers: [NotifierService],
  exports: [NotifierService],
})
export class SlackModule {}
