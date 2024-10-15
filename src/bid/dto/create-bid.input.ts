import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateBidInput {
  // @Field()
  // name:string;

  @Field()
  amount?:number;

}
