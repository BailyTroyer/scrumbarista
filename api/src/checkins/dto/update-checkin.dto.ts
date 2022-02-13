import { IsBoolean, IsOptional, IsNotEmpty, IsString } from "class-validator";

export class UpdateCheckinDto {
  @IsString({ each: true })
  @IsNotEmpty()
  answers: string[];

  @IsString()
  @IsNotEmpty()
  postMessageTs: string;

  @IsBoolean()
  @IsOptional()
  outOfOffice?: boolean;
}
