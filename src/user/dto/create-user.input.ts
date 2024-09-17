import { InputType, Field } from '@nestjs/graphql';
import { StateNames } from '@prisma/client';
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { UserRoleType, UserStatusType } from 'src/role/user.role';

@InputType()
export class CreateUserInput {
  @Field({nullable:true})
  @IsOptional() 
  @IsEmail()
  email: string;

  @Field({nullable:true})
  username: string;

  @Field({nullable:true})
  firstName: string;

  @Field({nullable:true})
  lastName: string;

  @Field({nullable:true})
  businessName: string;

  @Field({nullable:true})
  @IsNotEmpty({ message: 'Mobile number is required' })
  mobile: string;

  @Field({ nullable: true })
  password?: string;

  @Field({ nullable: true })
  BalanceEMDAmount?: number;

  @Field({nullable:true})
  @IsNotEmpty({message:"pancard number is required"})
  pancardNo: string;

  @Field({nullable:true})
  idProofNo: string;

  @Field({nullable:true})
  country: string;

  @Field({nullable:true})
  city: string;

  @Field({nullable:true})
  userCategory: string;

  @Field({ nullable: true })
  tempToken?: number;

  @Field({ nullable: true })
  accessToken?: string;

  @Field(() => UserRoleType, { nullable: true })
  role: UserRoleType;
  
  @Field(()=>StateNames,{nullable:true})
  @IsNotEmpty({message:"state name required"})
  state:StateNames;

  @Field(()=>UserStatusType,{nullable:true}) 
  status?:UserStatusType;

}


