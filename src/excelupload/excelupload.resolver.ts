import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { ExceluploadService } from './excelupload.service';
import { Excelupload } from './models/excelupload.model';
import { CreateExceluploadInput } from './dto/create-excelupload.input';
import { UpdateExceluploadInput } from './dto/update-excelupload.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/role/role.guard';
import { Roles } from 'src/role/role.decorator';

@Resolver(() => Excelupload)
export class ExceluploadResolver {
  constructor(private readonly exceluploadService: ExceluploadService) {}

  @Mutation(returns => Excelupload)
  @UseGuards(GqlAuthGuard,RolesGuard)
  @Roles('admin', 'staff')
  async createExcelupload(@Args('createExceluploadInput') createExceluploadInput: CreateExceluploadInput,@Context() context) : Promise<Excelupload|null> {
    const {id}=context.req.user   
    return this.exceluploadService.createExcelUpload(id,createExceluploadInput);
  }

  @Query(() => [Excelupload], { name: 'excelupload' })
  findAll() {
    return this.exceluploadService.findAll();
  }

  @Query(() => Excelupload, { name: 'excelupload' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.exceluploadService.findOne(id);
  }

  @Mutation(() => Excelupload)
  updateExcelupload(@Args('updateExceluploadInput') updateExceluploadInput: UpdateExceluploadInput) {
    return this.exceluploadService.update(updateExceluploadInput);
  }

  @Mutation(() => Excelupload)
  removeExcelupload(@Args('id', { type: () => Int }) id: number) {
    return this.exceluploadService.remove(id);
  }
}
