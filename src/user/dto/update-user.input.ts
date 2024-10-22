import { InputType, Field } from '@nestjs/graphql';
import { StateNames } from '@prisma/client';
import { IsEmail, IsString, IsOptional } from 'class-validator';
import { UserIdProofTypeType, UserRoleType, UserStatusType } from 'src/role/user.roleStatus'
import { State } from 'src/state/models/state.model';

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
  password?: string;

  @Field({ nullable: true })
  @IsOptional()
  BalanceEMDAmount?: number;

  @Field({ nullable: true })
    pancardNo: string;

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

  @Field(() => UserRoleType,{nullable:true})
  role?: UserRoleType;  
  // @Field({ nullable: true })
  // @IsOptional()
  // accessToken?: string;
  @Field(()=>UserStatusType,{nullable:true}) 
  status:UserStatusType;

  @Field(()=>StateNames,{nullable:true})
  state?:StateNames;
  @Field(()=>UserIdProofTypeType,{nullable:true})
  idProofType:UserIdProofTypeType;

  // @Field(()=>[StateNames],{nullable:true})
  // states?:StateNames[];

}
