import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleDefinitionController } from './schedule-definition.controller';

describe('ScheduleDefinitionController', () => {
  let controller: ScheduleDefinitionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScheduleDefinitionController],
    }).compile();

    controller = module.get<ScheduleDefinitionController>(ScheduleDefinitionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
