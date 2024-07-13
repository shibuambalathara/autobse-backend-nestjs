import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateExceluploadInput {
  @Field()
  name?:string;

  @Field()
  file_filename:string;
 
}
