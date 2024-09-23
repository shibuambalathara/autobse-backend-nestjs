import { StateNames } from '@prisma/client';
import { CreateEnquiryInput } from './create-enquiry.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { ContactUsStatusType } from '../enquiryStatus';

@InputType()
export class UpdateEnquiryInput extends PartialType(CreateEnquiryInput) {
    @Field({nullable:true})
    firstName?: string;
  
    @Field({nullable:true})
    lastName?:string;
  
    @Field(()=>StateNames,{nullable:true})
    state?:StateNames;

    @Field({nullable:true})
    mobile?:string;


    @Field(()=>ContactUsStatusType,{nullable:true})
    status?:ContactUsStatusType;
    
}
