import { Test, TestingModule } from '@nestjs/testing';
import { EmdupdateResolver } from './emdupdate.resolver';
import { EmdupdateService } from './emdupdate.service';

describe('EmdupdateResolver', () => {
  let resolver: EmdupdateResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmdupdateResolver, EmdupdateService],
    }).compile();

    resolver = module.get<EmdupdateResolver>(EmdupdateResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
