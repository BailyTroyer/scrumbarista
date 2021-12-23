import { Exclude, Expose, Transform } from "class-transformer";
import { IsString, IsArray } from "class-validator";

import { Standup } from "../entities/standup.entity";

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
}
