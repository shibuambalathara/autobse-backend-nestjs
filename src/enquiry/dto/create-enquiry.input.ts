import { InputType, Int, Field, registerEnumType } from '@nestjs/graphql';
import { StateNames } from '@prisma/client';
import { ContactUsStatusType } from '../enquiryStatus';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class CreateEnquiryInput {
    @Field({nullable:true})
    firstName?: string;
  
    @Field({nullable:true})
    lastName?:string;
  
    @Field(()=>StateNames)
    state:StateNames;

    @Field()
    @IsNotEmpty()
    mobile:string;

    @Field({nullable:true})
    message?:string;

    @Field(()=>ContactUsStatusType,{nullable:true})
    status:ContactUsStatusType;
    
  
  }
  
  