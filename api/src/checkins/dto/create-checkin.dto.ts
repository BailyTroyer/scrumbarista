import { IsNotEmpty, IsString } from "class-validator";

export class CreateCheckinDto {
  @IsString()
  @IsNotEmpty()
  answers: string;

  @IsString()
  @IsNotEmpty()
  postMessageTs: string;

  @IsString()
  @IsNotEmpty()
  userId: string;
}
