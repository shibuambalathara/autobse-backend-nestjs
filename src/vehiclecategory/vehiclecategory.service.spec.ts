import { Test, TestingModule } from '@nestjs/testing';
import { VehiclecategoryService } from './vehiclecategory.service';

describe('VehiclecategoryService', () => {
  let service: VehiclecategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VehiclecategoryService],
    }).compile();

    service = module.get<VehiclecategoryService>(VehiclecategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
