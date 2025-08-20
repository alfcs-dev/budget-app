import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { withTransaction, PrismaClient } from '@budget-manager/database';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    // Use shared database package utilities for consistent configuration
    super({
      log:
        process.env.NODE_ENV === 'development'
          ? ['query', 'info', 'warn', 'error']
          : ['error'],
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    process.on('beforeExit', async () => {
      await app.close();
    });
  }

  // Expose transaction helper for services
  async executeTransaction<T>(
    callback: (
      tx: Parameters<Parameters<PrismaClient['$transaction']>[0]>[0],
    ) => Promise<T>,
  ): Promise<T> {
    return withTransaction(this, callback);
  }
}
