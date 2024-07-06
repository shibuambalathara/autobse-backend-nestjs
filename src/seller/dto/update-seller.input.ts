import { IsOptional, IsPhoneNumber, IsString } from 'class-validator';
import { CreateSellerInput } from './create-seller.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateSellerInput extends PartialType(CreateSellerInput) {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  name?:string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  contactPerson?:string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  GSTNumbber?:string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  billingContactPerson?:string;

  @Field({ nullable: true })
  @IsString()
  @IsPhoneNumber()
  @IsOptional()
  mobile?:string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  nationalHead?:string;
  

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  logo?:string;
}
