import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class VehicleCategory {
  @Field()
  id:string;

  @Field()
  name:string;

  @Field({nullable:true})
  createdAt?:Date;

  @Field({nullable:true})
  updatedAt?:Date;

  @Field({nullable:true})
  createdById?:string;
}
