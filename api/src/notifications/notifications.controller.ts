import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { CreateCronDto } from "./dto/create-cron.dto";
import { NotificationsService } from "./notifications.service";

@ApiTags("notifications")
@Controller("notifications")
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async getCrons() {
    return this.notificationsService.getCrons();
  }

  @Post()
  async createCron(@Body() { interval }: CreateCronDto) {
    return this.notificationsService.addCronJob(interval);
  }

  @Delete("crons/:id")
  async deleteCron(@Param("id") id: string) {
    return this.notificationsService.deleteCron(id);
  }
}
