import { Test, TestingModule } from '@nestjs/testing';
import { VehiclecategoryResolver } from './vehiclecategory.resolver';
import { VehiclecategoryService } from './vehiclecategory.service';

describe('VehiclecategoryResolver', () => {
  let resolver: VehiclecategoryResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VehiclecategoryResolver, VehiclecategoryService],
    }).compile();

    resolver = module.get<VehiclecategoryResolver>(VehiclecategoryResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
