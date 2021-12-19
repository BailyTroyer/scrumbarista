import { Exclude, Expose } from "class-transformer";
import { IsString, IsDate } from "class-validator";

@Exclude()
export class CheckinDto {
  @Expose()
  @IsString()
  id: string;

  @Expose()
  @IsDate()
  createdDate: Date;

  @Expose()
  @IsString()
  answers: string;

  @Expose()
  @IsString()
  postMessageTs: string;

  @Expose()
  @IsString()
  userId: string;
}
