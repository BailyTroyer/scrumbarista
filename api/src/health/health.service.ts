import { Injectable } from "@nestjs/common";

import { HealthDto } from "./dto/health.dto";

@Injectable()
export class HealthService {
  getHealth(): HealthDto {
    return { status: "healthy", time: new Date() };
  }
}
