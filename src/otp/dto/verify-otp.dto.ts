import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class VerfiyOtpDto {
    @Field()
    mobile: string;
    @Field()
    otp: string;

  

}