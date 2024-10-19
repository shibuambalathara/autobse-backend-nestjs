import { Test, TestingModule } from '@nestjs/testing';
import { AcrResolver } from './acr.resolver';
import { AcrService } from './acr.service';

describe('AcrResolver', () => {
  let resolver: AcrResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AcrResolver, AcrService],
    }).compile();

    resolver = module.get<AcrResolver>(AcrResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
