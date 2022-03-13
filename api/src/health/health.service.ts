import { Injectable } from "@nestjs/common";

import { HealthDto } from "./dto/health.dto";

@Injectable()
export class HealthService {
  getHealth(): HealthDto {
    console.log("TEST");
    return { status: "healthy", time: new Date() };
  }
}
