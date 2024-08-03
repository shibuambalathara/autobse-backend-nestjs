import { InputType, Field } from '@nestjs/graphql';


@InputType()
export class StatusWhereUniqueInput {

  @Field({nullable:true})
  id?:string;


}
