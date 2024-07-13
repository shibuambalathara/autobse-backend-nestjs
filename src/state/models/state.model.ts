import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Location } from 'src/location/models/location.model';

@ObjectType()
export class State {

  @Field()
  id:string;
  
  @Field()
  name:string;

  @Field({nullable:true})
  createdAt?:Date;

  @Field({nullable:true})
  updatedAt?:Date;

  @Field()
  createdById?:string;
  @Field()
  location?:Location;


}
