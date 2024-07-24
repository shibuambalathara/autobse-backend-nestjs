import { InputType, Int, Field, registerEnumType } from '@nestjs/graphql';
import { PaymentStatusTypes } from '@prisma/client';

@InputType()
export class CreateStatusInput {
    @Field(()=>PaymentStatusTypes)
    status:PaymentStatusTypes;

    @Field()
    comment?:string;

}

registerEnumType(PaymentStatusTypes, {
  name: 'PaymentStatusTypes',
});