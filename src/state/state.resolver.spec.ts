import { Test, TestingModule } from '@nestjs/testing';
import { StateResolver } from './state.resolver';
import { StateService } from './state.service';

describe('StateResolver', () => {
  let resolver: StateResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StateResolver, StateService],
    }).compile();

    resolver = module.get<StateResolver>(StateResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
