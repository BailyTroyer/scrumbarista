import { plainToClass } from "class-transformer";
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  validateSync,
} from "class-validator";

enum Environment {
  Development = "development",
  Production = "production",
  Test = "test",
  Provision = "provision",
}

class AppEnvironment {
  @IsEnum(Environment)
  NODE_ENV = Environment.Development;

  @IsNumber()
  PORT = 8000;

  @IsString()
  @IsNotEmpty()
  SLACK_SIGNING_SECRET: string;

  @IsString()
  @IsNotEmpty()
  SLACK_BOT_TOKEN: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(AppEnvironment, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
