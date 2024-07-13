import { CreateExceluploadInput } from './create-excelupload.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateExceluploadInput extends PartialType(CreateExceluploadInput) {
  @Field()
  name?:string;

  @Field()
  file_filename:string;
}
