import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

import { HealthDto } from "./dto/health.dto";
import { HealthService } from "./health.service";

@ApiTags("health")
@Controller("health")
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({ summary: "application healthiness" })
  @ApiResponse({ status: 200, description: "API healthy" })
  health(): HealthDto {
    return this.healthService.getHealth();
  }
}
