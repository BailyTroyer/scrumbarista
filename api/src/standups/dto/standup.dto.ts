import { Exclude, Expose, Transform, Type } from "class-transformer";
import { IsString, IsArray, IsBoolean, IsMilitaryTime } from "class-validator";

import { Standup } from "../entities/standup.entity";

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
  @IsString()
  questions: string;

  @IsArray()
  @Expose()
  @Transform(({ obj }: { obj: Standup }) => obj.days.map((day) => day.day))
  readonly days: string[];

  @Expose()
  @IsMilitaryTime()
  startTime: string;

  // @Expose()
  // @IsArray()
  // users: {
  //   id: string;
  //   image: string;
  //   name: string;
  // }[];

  @Expose()
  @IsArray()
  @Type(() => UserDto)
  users: UserDto;

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
