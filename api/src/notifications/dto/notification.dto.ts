import { IsString } from "class-validator";

export class NotificationDto {
  @IsString()
  interval: string;

  @IsString()
  channelId: string;
}
