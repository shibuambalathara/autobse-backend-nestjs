import { Test, TestingModule } from '@nestjs/testing';
import { ExceluploadResolver } from './excelupload.resolver';
import { ExceluploadService } from './excelupload.service';

describe('ExceluploadResolver', () => {
  let resolver: ExceluploadResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExceluploadResolver, ExceluploadService],
    }).compile();

    resolver = module.get<ExceluploadResolver>(ExceluploadResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
