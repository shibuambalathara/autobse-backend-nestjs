import { InputType, Int, Field } from '@nestjs/graphql';
import { StateNames } from '@prisma/client';

@InputType()
export class SendOtpDto {
    @Field()
    mobile: string;

    @Field({nullable:true})
    firstName:string

    @Field({nullable:true})
    lastName:string

    @Field({nullable:true})
    pancardNo:string

    @Field(()=>StateNames,{nullable:true})
    state:StateNames;
}