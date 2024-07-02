import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { StateService } from './state.service';
import { State } from './models/state.model';
import { CreateStateInput } from './dto/create-state.input';
import { UpdateStateInput } from './dto/update-state.input';
import { NotFoundException } from '@nestjs/common';
import { UniqueInput } from './dto/unique-state.input';

@Resolver(() => State)
export class StateResolver {
  constructor(private readonly stateService: StateService) {}

  @Mutation(() => State)
  async createState(@Args('createStateInput') createStateInput: CreateStateInput) {
    return this.stateService.createState(createStateInput);
  }

  @Query(() => [State])
  async getAllState() {
    return this.stateService.getAllState();
    
  }

  @Query(() => State)
  async getState(@Args('where') where:UniqueInput) {
    return this.stateService.getState(where.id);

  }

  @Query(()=> [State])
  async getAllDeletedState(){
    return this.stateService.getAllDeletedState()
  }

  @Query(()=>State)
  async getDeletedState(@Args('where') where: UniqueInput){
    return this.stateService.getDeletedState(where.id);
  }

  @Mutation(() => State)
  async updateState(@Args('where') where:UniqueInput, @Args('updateStateInput') updateStateInput: UpdateStateInput) {
   return this.stateService.updateState(where.id, updateStateInput);

  }

  @Mutation(() => State)
  async removeState(@Args('where') where: UniqueInput) {
    return this.stateService.removeState(where.id);
  }
}
