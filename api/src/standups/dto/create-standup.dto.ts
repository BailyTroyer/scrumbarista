import {
  IsNotEmpty,
  IsEnum,
  IsString,
  ArrayUnique,
  IsMilitaryTime,
} from "class-validator";

import { DayOfWeek } from "../entities/day.entity";

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

  @IsString()
  introMessage: string;
}
