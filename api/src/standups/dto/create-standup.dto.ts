import {
  IsNotEmpty,
  IsEnum,
  IsString,
  ArrayUnique,
  IsMilitaryTime,
  IsIn,
} from "class-validator";

import { DayOfWeek } from "../entities/day.entity";
import { timezone, timezones } from "../entities/tzoverride.entity";

export class CreateStandupDto {
  @IsString()
  name: string;

  @IsNotEmpty()
  channelId: string;

  @IsString({ each: true })
  questions: string[];

  @IsMilitaryTime()
  startTime: Date;

  @ArrayUnique()
  @IsEnum(DayOfWeek, { each: true })
  days: DayOfWeek[];

  @IsIn(timezones)
  timezone: timezone;

  @IsString()
  introMessage: string;
}
