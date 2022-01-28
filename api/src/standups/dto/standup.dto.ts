import { Exclude, Expose, Transform, Type } from "class-transformer";
import { IsString, IsArray, IsBoolean, IsMilitaryTime } from "class-validator";

import { Standup } from "../entities/standup.entity";
import { timezone } from "../entities/tzoverride.entity";

class UserDto {
  @Expose()
  @IsString()
  name: string;

  @Expose()
  @IsString()
  id: string;

  @Expose()
  @IsString()
  image: string;
}

@Exclude()
export class StandupDto {
  @Expose()
  @IsString()
  name: string;

  @Expose()
  @IsString()
  channelId: string;

  @Expose()
  @IsString({ each: true })
  questions: string[];

  @IsArray()
  @Expose()
  @Transform(({ obj }: { obj: Standup }) => obj.days.map((day) => day.day))
  readonly days: string[];

  @IsArray()
  @Expose()
  @Transform(
    ({ obj }: { obj: Standup }) =>
      obj.timezoneOverrides?.map((override) => ({
        timezone: override.timezone,
        userId: override.userId,
      })) || []
  )
  readonly timezoneOverrides: { userId: string; timezone: string }[];

  @Expose()
  timezone: timezone;

  @Expose()
  @IsMilitaryTime()
  startTime: string;

  @Expose()
  @IsArray()
  @Type(() => UserDto)
  users: UserDto[];

  @Expose()
  @IsBoolean()
  active: boolean;

  @Expose()
  @IsString()
  introMessage: string;

  @Expose()
  @IsString()
  channelName: string;
}
