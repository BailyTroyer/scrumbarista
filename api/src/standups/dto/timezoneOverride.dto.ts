import { Exclude, Expose } from "class-transformer";
import { IsString, IsIn } from "class-validator";

import { timezone, timezones } from "../entities/tzoverride.entity";

export class CreateTimezoneOverrideDto {
  @IsIn(timezones)
  timezone: timezone;
}

@Exclude()
export class TimezoneOverrideDto {
  @Expose()
  @IsString()
  userId: string;

  @Expose()
  @IsString()
  channelId: string;

  @Expose()
  timezone: timezone;
}
