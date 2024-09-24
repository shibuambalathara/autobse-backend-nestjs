import { ObjectType, Field } from '@nestjs/graphql';
import { User } from 'src/user/models/user.model';

@ObjectType()
export class OtpMessageDataDto {
    @Field(() => String)
    messageid: string;

    @Field(() => String)
    totnumber: string;

    @Field(() => String)
    totalcredit: string;
}

@ObjectType()
export class SendOtpResponse {
    @Field(() => String)
    status: string;

    @Field(() => String)
    code: string;

    @Field(() => String)
    description: string;

    @Field(() => OtpMessageDataDto, { nullable: true })
    data?: OtpMessageDataDto;
}