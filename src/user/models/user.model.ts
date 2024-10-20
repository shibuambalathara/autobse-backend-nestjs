import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Payment } from 'src/payment/models/payment.model';

@ObjectType()
export class User {
  @Field()
  id: string;

  @Field()
  idNo: number;

  @Field()
  email: string;

  @Field()
  username: string;

  @Field()
  role: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  businessName: string;

  @Field()
  mobile: string;

  @Field({ nullable: true })
  BalanceEMDAmount?: number;

  @Field({ nullable: true })
  pancard_image?: string;

  @Field({ nullable: true })
  aadharcard_front_image?: string;

  @Field({ nullable: true })
  aadharcard_back_image?: string;

  @Field({ nullable: true })
  driving_license_front_image?: string;

  @Field({ nullable: true })
  driving_license_back_image?: string;

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

  // @Field({ nullable: true })
  // accessToken?: string;
  @Field()
  status: string;

  @Field()
  state: string;

  @Field()
  idProofType: string;

   @Field(()=>[Payment],{nullable:true})
  payments?:Payment[];

  @Field(() => Int,{nullable:true})
  paymentsCount?: number;

  @Field(()=>Int,{nullable:true})
  vehicleBuyingLimit?:number
 
}
