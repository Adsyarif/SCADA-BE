import { Module } from '@nestjs/common';
import { DataLoggerController } from './data-logger.controller';
import { DataLoggerService } from './data-logger.service';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [DataLoggerController],
  providers: [DataLoggerService, PrismaService]
})
export class DataLoggerModule {}
