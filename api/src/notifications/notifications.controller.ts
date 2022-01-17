import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { plainToClass } from "class-transformer";

import { CheckinNotifierService } from "../core/modules/checkin-notifier.module";
import { CreateNotificationDto } from "./dto/create-notification.dto";
import { NotificationDto } from "./dto/notification.dto";
import { NotificationsService } from "./notifications.service";

@ApiTags("notifications")
@Controller("notifications")
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly checkinNotifier: CheckinNotifierService
  ) {}

  @Get()
  @ApiOperation({ summary: "list notifications" })
  @ApiResponse({ status: 200 })
  async getCrons(): Promise<NotificationDto[]> {
    return plainToClass(
      NotificationDto,
      await this.notificationsService.getCrons()
    );
  }

  @Post(":channelId")
  @ApiOperation({ summary: "create a standup notification" })
  @ApiResponse({ status: 201, description: "standup notification created" })
  async createCron(
    @Param("channelId") channelId: string,
    @Body() { interval }: CreateNotificationDto
  ): Promise<NotificationDto> {
    return plainToClass(
      NotificationDto,
      this.notificationsService.addCronJob(channelId, interval)
    );
  }

  @Post(":channelId/:userId")
  @ApiOperation({ summary: "create a user standup notification" })
  @ApiResponse({
    status: 201,
    description: "user standup notification created",
  })
  async createUserCron(
    @Param("channelId") channelId: string,
    @Param("userId") userId: string,
    @Body() { interval }: CreateNotificationDto
  ): Promise<NotificationDto> {
    return plainToClass(
      NotificationDto,
      this.notificationsService.addUserCronJob(channelId, interval, userId)
    );
  }

  @Delete("crons/:channelId")
  @ApiOperation({ summary: "delete standup notification" })
  @ApiResponse({ status: 200 })
  async deleteCron(@Param("channelId") channelId: string): Promise<string> {
    return this.notificationsService.deleteCron(channelId);
  }

  @Delete("crons/:channelId/:userId")
  @ApiOperation({ summary: "delete user standup notification" })
  @ApiResponse({ status: 200 })
  async deleteUserCron(
    @Param("channelId") channelId: string,
    @Param("userId") userId: string
  ): Promise<string> {
    return this.notificationsService.deleteCronForUser(channelId, userId);
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
