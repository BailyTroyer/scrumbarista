import { Exclude, Expose, Transform } from "class-transformer";
import { IsString, IsDate, IsOptional, IsBoolean } from "class-validator";

import { Checkin } from "../entities/checkin.entity";

@Exclude()
export class CheckinDto {
  @Expose()
  @IsString()
  id: string;

  @Expose()
  @IsDate()
  createdDate: Date;

  @Expose()
  @IsString({ each: true })
  answers: string[];

  @Expose()
  @IsString()
  postMessageTs: string;

  @Expose()
  @IsString()
  userId: string;

  @IsString()
  @IsOptional()
  @Expose()
  @Transform(({ obj }: { obj: Checkin }) => obj.standup?.channelId)
  readonly channelId: string;

  @Expose()
  @IsBoolean()
  outOfOffice: boolean;
}
