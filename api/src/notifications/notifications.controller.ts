import { Controller, Get, Param, Post } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { plainToClass } from "class-transformer";

import { NotificationDto } from "./dto/notification.dto";
import { NotificationsService } from "./notifications.service";

@ApiTags("notifications")
@Controller("notifications")
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: "list notifications" })
  @ApiResponse({ status: 200 })
  async getCrons(): Promise<NotificationDto[]> {
    return plainToClass(
      NotificationDto,
      await this.notificationsService.getCrons()
    );
  }

  @Post("standups/:channelId/checkins/trigger")
  @ApiOperation({ summary: "trigger a standup checkin to all users" })
  @ApiResponse({ status: 200 })
  async notifyAll(@Param("channelId") channelId: string): Promise<void> {
    return this.notificationsService.pingUsersForCheckin(channelId);
  }

  @Post("standups/:channelId/checkins/:userId/trigger")
  @ApiOperation({ summary: "trigger a standup checkin for a given user" })
  @ApiResponse({ status: 200 })
  async notifyUser(
    @Param("channelId") channelId: string,
    @Param("userId") userId: string
  ): Promise<void> {
    return this.notificationsService.pingUserForCheckin(channelId, userId);
  }
}
