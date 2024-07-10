import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

@InputType()
export class CreateSellerInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  name:string;

  @Field()
  @IsString()
  contactPerson:string;

  @Field()
  @IsString()
  GSTNumber:string;

  @Field()
  @IsString()
  billingContactPerson:string;

  @Field()
  @IsString()
  @IsPhoneNumber()
  mobile:string;

  @Field()
  @IsString()
  nationalHead:string;
  

  @Field()
  @IsString()
  logo:string;
  
}
