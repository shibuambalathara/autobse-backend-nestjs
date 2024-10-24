import { ObjectType, Field, Int } from '@nestjs/graphql';
import { StateNames } from '@prisma/client';
import { IsEnum } from 'class-validator';
import { Location } from 'src/location/models/location.model';
import { User } from 'src/user/models/user.model';

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
  
  @Field(()=>[Location],{nullable:true})
  location?:Location[];

  @Field(()=>User,{nullable:true})
  createdBy?:User;

}
