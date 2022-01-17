import { IsString } from "class-validator";

export class CreateNotificationDto {
  @IsString()
  interval: string;

  @IsString()
  channelId: string;
}
