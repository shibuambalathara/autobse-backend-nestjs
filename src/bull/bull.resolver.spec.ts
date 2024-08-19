import { Test, TestingModule } from '@nestjs/testing';
import { BullResolver } from './bull.resolver';
import { BullBoardService } from './bullboard.service';

describe('BullResolver', () => {
  let resolver: BullResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BullResolver, BullBoardService],
    }).compile();

    resolver = module.get<BullResolver>(BullResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
