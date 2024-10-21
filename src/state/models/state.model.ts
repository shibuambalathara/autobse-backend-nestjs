import { ObjectType, Field, Int } from '@nestjs/graphql';
import { StateNames } from '@prisma/client';
import { IsEnum } from 'class-validator';
import { Location } from 'src/location/models/location.model';

@ObjectType()
export class State {

  @Field()
  id:string;
  
  @Field(() => StateNames)
  @IsEnum(StateNames)
  name: StateNames;
  
  @Field({nullable:true})
  createdAt?:Date;

  @Field({nullable:true})
  updatedAt?:Date;

  @Field()
  createdById?:string;
  
  @Field()
  location?:Location;


}
