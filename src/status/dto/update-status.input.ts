import { $Enums, PaymentStatusTypes } from '@prisma/client';
import { CreateStatusInput } from './create-status.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateStatusInput extends PartialType(CreateStatusInput) {
  @Field(() => PaymentStatusTypes)
  status?:PaymentStatusTypes;

  @Field({nullable:true})
  comment?: string;
 
}
