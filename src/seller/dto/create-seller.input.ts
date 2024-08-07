import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

@InputType()
export class CreateSellerInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  name:string;

  @Field({nullable:true})
  @IsString()
  contactPerson:string;

  @Field({nullable:true})
  @IsString()
  GSTNumber:string;

  @Field({nullable:true})
  @IsString()
  billingContactPerson:string;

  @Field({nullable:true})
  @IsString()
  @IsPhoneNumber()
  mobile:string;

  @Field({nullable:true})
  @IsString()
  nationalHead:string;
  

  @Field({nullable:true})
  @IsString()
  logo:string;
  
}
