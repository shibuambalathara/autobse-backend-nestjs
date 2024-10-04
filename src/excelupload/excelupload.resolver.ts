import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { ExceluploadService } from './excelupload.service';
import { Excelupload } from './models/excelupload.model';
import { CreateExceluploadInput } from './dto/create-excelupload.input';
import { UpdateExceluploadInput } from './dto/update-excelupload.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/role/role.guard';
import { Roles } from 'src/role/role.decorator';
// import { FileUpload } from 'graphql-upload/processRequest.mjs';
import { ExcelWhereUniqueInput } from './dto/unique-excelupload.input';


@Resolver(() => Excelupload)
export class ExceluploadResolver {
  constructor(private readonly exceluploadService: ExceluploadService) {}


  @UseGuards(GqlAuthGuard,RolesGuard)
  @Roles('admin', 'staff')
  @Mutation(() => Excelupload)
  async createExcelupload(
    // @Args('userId') userId:string,
    @Args('eventId') eventId:string,
    @Args('createExceluploadInput') createExceluploadInput: CreateExceluploadInput,
    @Context() context
  ): Promise<Excelupload|null|Boolean> {
    const { id } = context.req.user;
    return this.exceluploadService.createExcelUpload( id,eventId,createExceluploadInput);
  }

  
  @Query(returns => [Excelupload])
  async excelUploads() :Promise<Excelupload[]|null> {
    return this.exceluploadService.excelUploads();
  }

  
  @Query(returns => Excelupload)
  async excelUpload(@Args('where') where:ExcelWhereUniqueInput):Promise<Excelupload|null>{
    return this.exceluploadService.excelUpload(where);
  }

 
  @UseGuards(GqlAuthGuard,RolesGuard)
  @Roles('admin')
  @Mutation(returns => Excelupload)
  async deleteExcelupload(@Args('where') where:ExcelWhereUniqueInput ):Promise<Excelupload|null>{
    return this.exceluploadService.deleteExcelupload(where.id);
  }


  @UseGuards(GqlAuthGuard,RolesGuard)
  @Roles('admin')
  @Mutation(returns => Excelupload)
  async restoreExcelUpload(@Args('where') where:ExcelWhereUniqueInput):Promise<Excelupload|null>{
    return this.exceluploadService.restoreExcelUpload(where);
  }
}
