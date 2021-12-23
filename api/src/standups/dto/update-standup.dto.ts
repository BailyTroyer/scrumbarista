import { PartialType } from "@nestjs/mapped-types";
import { IsString, IsOptional, ArrayUnique, IsEnum } from "class-validator";

import { DayOfWeek } from "../entities/day.entity";
import { CreateStandupDto } from "./create-standup.dto";

export class UpdateStandupDto extends PartialType(CreateStandupDto) {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  questions?: string;

  @IsOptional()
  @ArrayUnique()
  @IsEnum(DayOfWeek, { each: true })
  days?: DayOfWeek[];
}
