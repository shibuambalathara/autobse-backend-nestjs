import { Test, TestingModule } from '@nestjs/testing';
import { RecentsoldService } from './recentsold.service';

describe('RecentsoldService', () => {
  let service: RecentsoldService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RecentsoldService],
    }).compile();

    service = module.get<RecentsoldService>(RecentsoldService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
