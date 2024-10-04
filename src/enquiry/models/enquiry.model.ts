import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Enquiry {
 
    @Field()
    firstName?:string;
  
    @Field()
    lastName?:string;
  
    @Field()
    message?:string;
  
    @Field()
    mobile:string;

    @Field()
    state:string;

    @Field()
    status?:string;
  }
  

