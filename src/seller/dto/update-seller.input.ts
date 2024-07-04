import { IsOptional, IsPhoneNumber, IsString } from 'class-validator';
import { CreateSellerInput } from './create-seller.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateSellerInput extends PartialType(CreateSellerInput) {
  @Field()
  @IsString()
  @IsOptional()
  name:string;

  @Field()
  @IsString()
  @IsOptional()
  contactPerson:string;

  @Field()
  @IsString()
  @IsOptional()
  GSTNumbber:string;

  @Field()
  @IsString()
  @IsOptional()
  billingContactPerson:string;

  @Field()
  @IsString()
  @IsPhoneNumber()
  @IsOptional()
  mobile:string;

  @Field()
  @IsString()
  @IsOptional()
  nationalHead:string;
  

  @Field()
  @IsString()
  @IsOptional()
  logo:string;
}
