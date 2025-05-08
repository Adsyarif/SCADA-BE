import { Test, TestingModule } from '@nestjs/testing';
import { RtuConfigurationController } from './rtu-configuration.controller';

describe('RtuConfigurationController', () => {
  let controller: RtuConfigurationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RtuConfigurationController],
    }).compile();

    controller = module.get<RtuConfigurationController>(RtuConfigurationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
