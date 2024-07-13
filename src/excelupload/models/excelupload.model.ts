import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Excelupload {
  @Field()
  id:string;
  
  @Field({nullable:true})
  name?:string;

  @Field()
  file_filename:string;

  @Field({nullable:true})
  createdAt?:Date;

  @Field({nullable:true})
  updatedAt?:Date;

  @Field()
  createdById?:string;
  
}
