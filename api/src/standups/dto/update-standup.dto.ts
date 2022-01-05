import { PartialType } from "@nestjs/mapped-types";
import {
  IsString,
  IsOptional,
  ArrayUnique,
  IsEnum,
  IsMilitaryTime,
  IsBoolean,
} from "class-validator";

import { DayOfWeek } from "../entities/day.entity";
import { CreateStandupDto } from "./create-standup.dto";

export class UpdateStandupDto extends PartialType(CreateStandupDto) {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString({ each: true })
  questions?: string[];

  @IsMilitaryTime()
  startTime: Date;

  @IsBoolean()
  @IsOptional()
  active: boolean;

  @IsOptional()
  @ArrayUnique()
  @IsEnum(DayOfWeek, { each: true })
  days?: DayOfWeek[];

  @IsOptional()
  @IsString()
  introMessage: string;
}
