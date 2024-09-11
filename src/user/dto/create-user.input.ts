import { InputType, Field } from '@nestjs/graphql';
import { StateNames } from '@prisma/client';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { UserRoleType } from 'src/role/user.role';

@InputType()
export class CreateUserInput {
  @Field({nullable:true})
  @IsEmail()
  email: string;

  @Field({nullable:true})
  username: string;

  @Field({nullable:true})
  @IsString()
  firstName: string;

  @Field({nullable:true})
  lastName: string;

  @Field({nullable:true})
  businessName: string;

  @Field()
  @IsNotEmpty({ message: 'Mobile number is required' })
  mobile: string;

  @Field({ nullable: true })
  password?: string;

  @Field({ nullable: true })
  BalanceEMDAmount?: number;

  @Field({nullable:true})
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
  
  @Field(()=>StateNames)
  state:StateNames;

}


