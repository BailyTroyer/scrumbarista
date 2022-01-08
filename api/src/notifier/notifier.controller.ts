import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { CreateCronDto } from "../notifier/dto/create-cron.dto";
import { NotifierService } from "./notifier.service";

@ApiTags("notifier")
@Controller("notifier")
export class NotifierController {
  constructor(private readonly notifierService: NotifierService) {}

  @Get("crons")
  async getCrons() {
    return this.notifierService.getCrons();
  }

  @Post("crons")
  async createCron(@Body() body: CreateCronDto) {
    return this.notifierService.addCronJob(body.name, body.seconds);
  }

  @Delete("crons/:name")
  async deleteCron(@Param("name") name: string) {
    return this.notifierService.deleteCron(name);
  }
}
