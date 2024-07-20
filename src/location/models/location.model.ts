import { ObjectType, Field, Int } from '@nestjs/graphql';
import { StateNames } from '@prisma/client';
// import { State } from 'src/state/models/state.model';

@ObjectType()
export class Location {
  
  @Field()
  id:string;

  @Field()
  name:string;

  // @Field()
  // stateId:string;

  @Field(() => StateNames)
  state:StateNames;

  @Field({nullable:true})
  createdAt?:Date;

  @Field({nullable:true})
  updatedAt?:Date;

  @Field({nullable:true})
  country?:string;

  @Field({nullable:true})
  createdById?:string;
  
}
