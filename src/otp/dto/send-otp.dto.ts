import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class SendOtpDto {
    @Field()
    mobile: string;
}