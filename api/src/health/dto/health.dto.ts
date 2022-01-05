import { IsString, IsDate } from "class-validator";

export class HealthDto {
  @IsString()
  status: string;

  @IsDate()
  time: Date;
}
