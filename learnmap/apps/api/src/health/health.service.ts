import { Injectable } from '@nestjs/common';
import type { DbHealthResponse, HealthResponse } from '@learnmap/shared';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HealthService {
  constructor(private readonly prisma: PrismaService) {}

  getHealth(): HealthResponse {
    return { status: 'ok' };
  }

  async getDbHealth(): Promise<DbHealthResponse> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return { status: 'ok', database: 'connected' };
    } catch {
      return { status: 'error', database: 'disconnected' };
    }
  }
}
