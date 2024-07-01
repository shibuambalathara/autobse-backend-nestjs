import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { StateService } from './state.service';
import { State } from './models/state.model';
import { CreateStateInput } from './dto/create-state.input';
import { UpdateStateInput } from './dto/update-state.input';

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
  async getState(@Args('id') id: string) {
    return await this.stateService.getState(id);
  }

  @Mutation(() => State)
  async updateState(@Args('id') id:string, @Args('updateStateInput') updateStateInput: UpdateStateInput) {
    return this.stateService.updateState(id, updateStateInput);
  }

  @Mutation(() => State)
  async removeState(@Args('id') id: string) {
    return this.stateService.removeState(id);
  }
}
