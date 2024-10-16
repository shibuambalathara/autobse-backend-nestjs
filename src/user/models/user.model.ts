import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field()
  id: string;

  @Field()
  email: string;


  @Field()
  username: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  businessName: string;

  @Field()
  mobile: string;

  @Field({ nullable: true })
  password?: string;

  @Field({ nullable: true })
  BalanceEMDAmount?: number;

  @Field()
  pancardNo: string;

  @Field()
  idProofNo: string;

  @Field()
  country: string;

  @Field()
  city: string;

  @Field()
  userCategory: string;

  @Field({ nullable: true })
  tempToken?: number;

  @Field({ nullable: true })
  accessToken?: string;


}
