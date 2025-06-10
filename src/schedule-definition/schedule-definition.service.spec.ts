import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleDefinitionService } from './schedule-definition.service';

describe('ScheduleDefinitionService', () => {
  let service: ScheduleDefinitionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScheduleDefinitionService],
    }).compile();

    service = module.get<ScheduleDefinitionService>(ScheduleDefinitionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
