import { ObjectType, Field, Int } from '@nestjs/graphql';
import { PaymentStatusTypes } from '@prisma/client';

@ObjectType()
export class Status {
   @Field()
   status:PaymentStatusTypes;

   @Field()
   comment:string;

   @Field()
   createdAt?:Date;

   @Field()
   updatedAt?:Date;

   @Field()
   createdById?:string;
}
