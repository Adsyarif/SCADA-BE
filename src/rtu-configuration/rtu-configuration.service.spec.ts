import { Test, TestingModule } from '@nestjs/testing';
import { RtuConfigurationService } from './rtu-configuration.service';

describe('RtuConfigurationService', () => {
  let service: RtuConfigurationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RtuConfigurationService],
    }).compile();

    service = module.get<RtuConfigurationService>(RtuConfigurationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
