import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { StateService } from './state.service';
import { State } from './models/state.model';
import { CreateStateInput } from './dto/create-state.input';
import { UpdateStateInput } from './dto/update-state.input';
import { NotFoundException, UseGuards } from '@nestjs/common';
import { UniqueInput } from './dto/unique-state.input';
import { GqlAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/role/role.decorator';
import { RolesGuard } from 'src/role/role.guard';


@Resolver(() => State)
export class StateResolver {
  constructor(private readonly stateService: StateService) {}

  @UseGuards(GqlAuthGuard,RolesGuard)
     @Roles('admin', 'staff')
  @Mutation(() => State)
  async createState(@Args('createStateInput') createStateInput: CreateStateInput) {
    return this.stateService.createState(createStateInput);
  }

  @Query(() => [State])
  async States() {
    return this.stateService.States();
    
  }

  @Query(() => State)
  async State(@Args('where') where:UniqueInput) {
    return this.stateService.State(where.id);

  }

  @Mutation(() => State)
  async deleteState(@Args('where') where: UniqueInput){
    return this.stateService.deleteState(where.id);
  }

  @Mutation(() => State)
  async updateState(@Args('where') where:UniqueInput, @Args('updateStateInput') updateStateInput: UpdateStateInput) {
   return this.stateService.updateState(where.id, updateStateInput);

  }

  @Query(()=> [State])
  async deletedStates(){
    return this.stateService.deletedStates()
  }

  @Query(()=>State)
  async deletedState(@Args('where') where: UniqueInput) {
    return this.stateService.deletedState(where.id);
  }
}
