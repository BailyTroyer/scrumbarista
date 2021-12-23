import { IsNotEmpty, IsEnum, IsString, ArrayUnique } from "class-validator";

import { DayOfWeek } from "../entities/day.entity";

export class CreateStandupDto {
  @IsString()
  name: string;

  @IsNotEmpty()
  channelId: string;

  @IsString()
  questions: string;

  @ArrayUnique()
  @IsEnum(DayOfWeek, { each: true })
  days: DayOfWeek[];
}
