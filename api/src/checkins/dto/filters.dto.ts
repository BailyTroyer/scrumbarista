import { Transform, Type } from "class-transformer";
import { IsString, IsOptional, IsArray } from "class-validator";

export class UserFilterDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Type(() => String)
  @Transform(({ obj: { users } }) => {
    return users.split(",");
  })
  users: string[];
}
