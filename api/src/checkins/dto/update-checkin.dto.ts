import { IsNotEmpty, IsString } from "class-validator";

export class UpdateCheckinDto {
  @IsString()
  @IsNotEmpty()
  answers: string;

  @IsString()
  @IsNotEmpty()
  postMessageTs: string;
}
