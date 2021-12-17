import { Catch, ExceptionFilter, ArgumentsHost } from "@nestjs/common";
import { Response } from "express";
import { EntityNotFoundError } from "typeorm/error/EntityNotFoundError";

/**
 * Custom exception filter to convert EntityNotFoundError from TypeOrm to NestJs responses
 * @see also @https://docs.nestjs.com/exception-filters
 * @see also https://gist.github.com/gsusmonzon/ecd7842495f07594761e40c2758617d0
 */
@Catch(EntityNotFoundError)
export class EntityNotFoundExceptionFilter implements ExceptionFilter {
  public catch(exception: EntityNotFoundError, host: ArgumentsHost) {
    console.log("NOT FOUND");
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    return response.status(404).json({
      message: {
        statusCode: 404,
        error: "Not Found",
        message: exception.message,
      },
    });
  }
}
