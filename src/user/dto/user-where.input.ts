import { InputType, Field } from '@nestjs/graphql';
import { StateNames } from '@prisma/client';

@InputType()
export class UserWhereUniqueInput {
  @Field({ nullable: true })
  id: string;

  @Field({ nullable: true })
  mobile: string;

  @Field({ nullable: true })
  tempToken: number;

  @Field({ nullable: true })
  idNo: number;

  @Field({ nullable: true })
  pancardNo: string;

  @Field(()=>StateNames,{ nullable: true })
  state?: StateNames;
  
  
  
}
