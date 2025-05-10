import { Module } from '@nestjs/common';
import { RtuConfigurationController } from './rtu-configuration.controller';
import { RtuConfigurationService } from './rtu-configuration.service';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [RtuConfigurationController],
  providers: [RtuConfigurationService, PrismaService]
})
export class RtuConfigurationModule {}
