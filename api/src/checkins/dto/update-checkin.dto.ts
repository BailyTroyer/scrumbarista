import { IsNotEmpty, IsString } from "class-validator";

export class UpdateCheckinDto {
  @IsString({ each: true })
  @IsNotEmpty()
  answers: string[];

  @IsString()
  @IsNotEmpty()
  postMessageTs: string;
}
