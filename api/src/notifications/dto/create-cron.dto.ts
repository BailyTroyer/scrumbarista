import { IsString } from "class-validator";

export class CreateCronDto {
  @IsString()
  interval: string;
}
