import { Test, TestingModule } from '@nestjs/testing';
import { DataLoggerController } from './data-logger.controller';

describe('DataLoggerController', () => {
  let controller: DataLoggerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DataLoggerController],
    }).compile();

    controller = module.get<DataLoggerController>(DataLoggerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
