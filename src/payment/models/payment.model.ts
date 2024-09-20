import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Status } from '@prisma/client';

@ObjectType()
export class Payment {
   @Field()
   id:string;
   
   @Field({nullable:true})
   refNo?:number;

   @Field({nullable:true})
   amount?:number;

   @Field({nullable:true})
   description?:string;

   @Field({ nullable: true })
   statusId?:string;

   @Field({nullable:true})
   userId?:string;

   @Field({nullable:true})
   image?:string;

   @Field({nullable:true})
   createdAt?:Date;

   @Field({nullable:true})
   updatedAt?:Date;

   @Field({nullable:true})
   createdById?:string;

   @Field({nullable:true})
   registrationExpire?:Date;


}
