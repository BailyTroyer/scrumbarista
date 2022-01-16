import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

import { CheckinNotifierService } from "../core/modules/checkin-notifier.module";
import { CreateCronDto } from "./dto/create-cron.dto";
import { NotificationsService } from "./notifications.service";

@ApiTags("notifications")
@Controller("notifications")
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly checkinNotifier: CheckinNotifierService
  ) {}

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

  @Post("standups/:channelId/checkins/trigger")
  @ApiOperation({ summary: "trigger a standup checkin to all users" })
  @ApiResponse({ status: 200 })
  async notifyAll(@Param("channelId") channelId: string): Promise<void> {
    return this.checkinNotifier.pingUsersForCheckin(channelId);
  }

  @Post("standups/:channelId/checkins/:userId/trigger")
  @ApiOperation({ summary: "trigger a standup checkin for a given user" })
  @ApiResponse({ status: 200 })
  async notifyUser(
    @Param("channelId") channelId: string,
    @Param("userId") userId: string
  ): Promise<void> {
    return this.checkinNotifier.pingUserForCheckin(channelId, userId);
  }
}
