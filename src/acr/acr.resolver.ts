import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AcrService } from './acr.service';
import GraphQLJSON from 'graphql-type-json';  

@Resolver(() => GraphQLJSON)
export class AcrResolver {
  constructor(private readonly acrService: AcrService) {}

  @Query(() => GraphQLJSON,{nullable:true})
  async getAcr(@Args('eventId', { type: () => String }) eventId: string) {
    return this.acrService.getAcr(eventId);
  }

  
}
