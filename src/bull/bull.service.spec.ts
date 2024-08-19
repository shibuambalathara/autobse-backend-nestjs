import { Test, TestingModule } from '@nestjs/testing';
import { BullBoardService } from './bullboard.service';

describe('BullService', () => {
  let service: BullBoardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BullBoardService],
    }).compile();

    service = module.get<BullBoardService>(BullBoardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
