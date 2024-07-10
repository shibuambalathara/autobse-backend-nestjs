import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { StateService } from './state.service';
import { State } from './models/state.model';
import { CreateStateInput } from './dto/create-state.input';
import { UpdateStateInput } from './dto/update-state.input';
import { NotFoundException, UseGuards } from '@nestjs/common';
import { StateWhereUniqueInput } from './dto/unique-state.input';
import { AuthGuard } from '@nestjs/passport';
import { GqlAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserRoleType } from '@prisma/client';


@Resolver(() => State)
export class StateResolver {
  constructor(private readonly stateService: StateService) {}

  @Mutation(returns => State)
   @UseGuards(GqlAuthGuard)
   
  async createState(@Args('userId') userId:string,@Args('createStateInput') createStateInput: CreateStateInput) : Promise<State | null> {
    return this.stateService.createState(userId,createStateInput);
  }

  @Query(returns => [State])
  async States(): Promise<State[] | null> {
    return this.stateService.States();
    
  }

  @Query(returns => State)
  async State(@Args('where') where:StateWhereUniqueInput):Promise<State|null> {
    return this.stateService.State(where);

  }

  @Mutation(returns => State)
  @UseGuards(GqlAuthGuard)
  async deleteState(@Args('where') where: StateWhereUniqueInput):Promise<State|null>{
    return this.stateService.deleteState(where.id);
  }

  @Mutation(returns => State)
  @UseGuards(GqlAuthGuard)
  async updateState(@Args('where') where:StateWhereUniqueInput, @Args('updateStateInput') updateStateInput: UpdateStateInput):Promise<State|null> {
   return this.stateService.updateState(where.id, updateStateInput);

  }

  @Query(returns=> [State])
  @UseGuards(GqlAuthGuard)
  async deletedStates():Promise<State[]|null>{
    return this.stateService.deletedStates()
  }

  @Query(returns=>State)
  @UseGuards(GqlAuthGuard)
  async deletedState(@Args('where') where: StateWhereUniqueInput) :Promise<State|null>{
    return this.stateService.deletedState(where.id);
  }

  @Query(returns=>State)
  @UseGuards(GqlAuthGuard)
  async restoreState(@Args('where') where:StateWhereUniqueInput):Promise<State|null>{
    return this.stateService.restoreState(where.id);

  }
}
