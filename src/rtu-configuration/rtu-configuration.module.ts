import { Module } from '@nestjs/common';
import { RtuConfigurationController } from './rtu-configuration.controller';
import { RtuConfigurationService } from './rtu-configuration.service';

@Module({
  controllers: [RtuConfigurationController],
  providers: [RtuConfigurationService]
})
export class RtuConfigurationModule {}
