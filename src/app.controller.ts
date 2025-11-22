import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  HealthCheckService,
  HealthCheck,
  HealthCheckResult,
  PrismaHealthIndicator,
} from '@nestjs/terminus';
import { PrismaService } from './prisma/prisma.service';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private prismaHealth: PrismaHealthIndicator,
    private prisma: PrismaService,
  ) {}

  @Get()
  @HealthCheck()
  @ApiOperation({
    summary: 'Health Check',
    description: 'Verifica o status de saúde da aplicação e suas dependências (banco de dados)',
  })
  @ApiResponse({
    status: 200,
    description: 'Aplicação saudável',
    schema: {
      example: {
        status: 'ok',
        info: {
          database: {
            status: 'up',
          },
        },
        error: {},
        details: {
          database: {
            status: 'up',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 503,
    description: 'Aplicação com problemas',
    schema: {
      example: {
        status: 'error',
        info: {},
        error: {
          database: {
            status: 'down',
            message: 'Connection failed',
          },
        },
        details: {
          database: {
            status: 'down',
            message: 'Connection failed',
          },
        },
      },
    },
  })
  async check(): Promise<HealthCheckResult> {
    return this.health.check([
      () => this.prismaHealth.pingCheck('database', this.prisma),
    ]);
  }

  @Get('ready')
  @ApiOperation({
    summary: 'Readiness Check',
    description: 'Verifica se a aplicação está pronta para receber requisições',
  })
  @ApiResponse({
    status: 200,
    description: 'Aplicação pronta',
    schema: {
      example: {
        status: 'ready',
        timestamp: '2024-11-22T17:45:00.000Z',
        uptime: 3600,
      },
    },
  })
  async ready() {
    return {
      status: 'ready',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }

  @Get('live')
  @ApiOperation({
    summary: 'Liveness Check',
    description: 'Verifica se a aplicação está viva (responde a requisições)',
  })
  @ApiResponse({
    status: 200,
    description: 'Aplicação viva',
    schema: {
      example: {
        status: 'alive',
        timestamp: '2024-11-22T17:45:00.000Z',
      },
    },
  })
  async live() {
    return {
      status: 'alive',
      timestamp: new Date().toISOString(),
    };
  }
}
