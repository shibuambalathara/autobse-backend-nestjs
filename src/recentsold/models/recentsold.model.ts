import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Recentsold {
  @Field()
  image?:string;

  @Field()
  vehicleName?:string;

  @Field()
  location?:string;

  @Field()
  soldDate?:Date;
}
