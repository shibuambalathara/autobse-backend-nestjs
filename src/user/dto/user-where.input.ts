import { InputType, Field } from '@nestjs/graphql';

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
  
  
  
}
