import { PartialType } from "@nestjs/mapped-types";
import {
  IsString,
  IsOptional,
  ArrayUnique,
  IsEnum,
  IsMilitaryTime,
  IsBoolean,
  IsIn,
} from "class-validator";

import { DayOfWeek } from "../entities/day.entity";
import { timezone, timezones } from "../entities/tzoverride.entity";
import { CreateStandupDto } from "./create-standup.dto";

export class UpdateStandupDto extends PartialType(CreateStandupDto) {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString({ each: true })
  questions?: string[];

  @IsMilitaryTime()
  startTime: string;

  @IsBoolean()
  @IsOptional()
  active: boolean;

  @IsOptional()
  @ArrayUnique()
  @IsEnum(DayOfWeek, { each: true })
  days?: DayOfWeek[];

  @IsIn(timezones)
  timezone: timezone;

  @IsOptional()
  @IsString()
  introMessage: string;
}
