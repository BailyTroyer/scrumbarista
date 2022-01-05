import { IsNotEmpty, IsString } from "class-validator";

export class CreateCheckinDto {
  @IsString({ each: true })
  answers: string[];

  @IsString()
  postMessageTs: string;

  @IsString()
  @IsNotEmpty()
  userId: string;
}
