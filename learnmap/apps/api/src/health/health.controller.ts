import { Controller, Get } from '@nestjs/common';
import type { DbHealthResponse, HealthResponse } from '@learnmap/shared';
import { HealthService } from './health.service';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  getHealth(): HealthResponse {
    return this.healthService.getHealth();
  }

  @Get('db')
  async getDbHealth(): Promise<DbHealthResponse> {
    return this.healthService.getDbHealth();
  }
}
