import { Test, TestingModule } from '@nestjs/testing';
import { DataLoggerService } from './data-logger.service';

describe('DataLoggerService', () => {
  let service: DataLoggerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DataLoggerService],
    }).compile();

    service = module.get<DataLoggerService>(DataLoggerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
