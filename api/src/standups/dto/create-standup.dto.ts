import { Expose, Type } from "class-transformer";
import {
  IsNotEmpty,
  IsEnum,
  IsString,
  ArrayUnique,
  IsMilitaryTime,
  IsArray,
} from "class-validator";

import { DayOfWeek } from "../entities/day.entity";

class UserDto {
  @Expose()
  @IsString()
  name: string;

  @Expose()
  @IsString()
  email: string;

  @Expose()
  @IsString()
  image: string;
}

export class CreateStandupDto {
  @IsString()
  name: string;

  @IsNotEmpty()
  channelId: string;

  @IsString()
  questions: string;

  @IsMilitaryTime()
  startTime: Date;

  @IsArray()
  @Type(() => UserDto)
  user: UserDto;

  @ArrayUnique()
  @IsEnum(DayOfWeek, { each: true })
  days: DayOfWeek[];

  @IsString()
  introMessage: string;
}
