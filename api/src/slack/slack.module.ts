import { Module } from "@nestjs/common";

import { BoltModule } from "../core/modules/bolt.module";
import { SlackController } from "./slack.controller";
import { SlackService } from "./slack.service";

@Module({
  imports: [BoltModule],
  controllers: [SlackController],
  providers: [SlackService],
  exports: [SlackService],
})
export class SlackModule {}
