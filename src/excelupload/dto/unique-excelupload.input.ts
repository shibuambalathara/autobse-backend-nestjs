import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class ExcelWhereUniqueInput {

  @Field({nullable:true})
  id?:string;


}
