import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsString, IsOptional } from 'class-validator';
import { UserRoleType } from 'src/role/use.role';

@InputType()
export class UpdateUserInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsEmail()
  email?: string;

  @Field({ nullable: true })
  @IsOptional()
  username?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  firstName?: string;

  @Field({ nullable: true })
  @IsOptional()
  lastName?: string;

  @Field({ nullable: true })
  @IsOptional()
  businessName?: string;

  @Field({ nullable: true })
  @IsOptional()
  mobile?: string;

  @Field({ nullable: true })
  @IsOptional()
  password?: string;

  @Field({ nullable: true })
  @IsOptional()
  BalanceEMDAmount?: number;

  @Field({ nullable: true })
  @IsOptional()
  pancardNo?: string;

  @Field({ nullable: true })
  @IsOptional()
  idProofNo?: string;

  @Field({ nullable: true })
  @IsOptional()
  country?: string;

  @Field({ nullable: true })
  @IsOptional()
  city?: string;

  @Field({ nullable: true })
  @IsOptional()
  userCategory?: string;

  @Field({ nullable: true })
  @IsOptional()
  tempToken?: number;

  @Field(() => UserRoleType)
  role: UserRoleType;  
  // @Field({ nullable: true })
  // @IsOptional()
  // accessToken?: string;


}
