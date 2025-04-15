import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';
import { Logger } from 'winston';
import { Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'; // ❗ PERHATIKAN: bukan NEST_PROVIDER

@Injectable()
export class PrismaService
  extends PrismaClient<Prisma.PrismaClientOptions, string>
  implements OnModuleInit
{
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger, // ✅ Pakai WINSTON_MODULE_PROVIDER
  ) {
    super({
      log: [
        { emit: 'event', level: 'info' },
        { emit: 'event', level: 'warn' },
        { emit: 'event', level: 'error' },
        { emit: 'event', level: 'query' },
      ],
    });
  }

  onModuleInit() {
    this.$on('info', (event) => {
      this.logger.info(JSON.stringify(event));
    });

    this.$on('warn', (event) => {
      this.logger.warn(JSON.stringify(event));
    });

    this.$on('error', (event) => {
      this.logger.error(JSON.stringify(event));
    });

    this.$on('query', (event) => {
      this.logger.info(JSON.stringify(event));
    });
  }
}
