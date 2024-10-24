import { InputType, Field } from '@nestjs/graphql';

@InputType() 
export class QueryOptionsType {
    @Field({ nullable: true })
    enabled?: boolean; 

}