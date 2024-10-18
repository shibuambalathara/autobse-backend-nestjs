import { Test, TestingModule } from '@nestjs/testing';
import { EmdupdateService } from './emdupdate.service';

describe('EmdupdateService', () => {
  let service: EmdupdateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmdupdateService],
    }).compile();

    service = module.get<EmdupdateService>(EmdupdateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
