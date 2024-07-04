import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class VehicleCategory {
  @Field()
  id:string;

  @Field()
  name:string;
}