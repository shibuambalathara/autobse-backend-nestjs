import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

@InputType()
export class CreateSellerInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  name:string;

  @Field({nullable:true})
    contactPerson:string;

  @Field({nullable:true})
  GSTNumber:string;

  @Field({nullable:true})
  billingContactPerson:string;

  @Field({nullable:true})
    mobile:string;

  @Field({nullable:true})
   nationalHead:string;
  

  @Field({nullable:true})
  logo:string;
  
}
