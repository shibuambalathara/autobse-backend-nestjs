import { InputType, Field } from '@nestjs/graphql';
import { StateNames } from '@prisma/client';
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { UserIdProofTypeType, UserRoleType, UserStatusType } from 'src/role/user.roleStatus';

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
  @MinLength(10,{message:"The mobile number must contain a minimum of ten digits"})
  @MaxLength(10,{message:"Please check if the mobile number exceeds the allowed number of digits(10)"})

  mobile: string;

  @Field({ nullable: true })
  password?: string;

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

  @Field(()=>UserIdProofTypeType,{nullable:true})
  idProofType:UserIdProofTypeType;

}
