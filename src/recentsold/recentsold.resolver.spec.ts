import { Test, TestingModule } from '@nestjs/testing';
import { RecentsoldResolver } from './recentsold.resolver';
import { RecentsoldService } from './recentsold.service';

describe('RecentsoldResolver', () => {
  let resolver: RecentsoldResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RecentsoldResolver, RecentsoldService],
    }).compile();

    resolver = module.get<RecentsoldResolver>(RecentsoldResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
