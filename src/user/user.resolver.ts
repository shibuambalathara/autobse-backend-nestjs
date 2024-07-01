import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './models/user.model';
import { CreateUserInput } from './dto/create-user.input';

@Resolver(of => User)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(returns => User, { nullable: true })
  async user(@Args('id') id: string) {
    return this.userService.getUser(id);
  }

  @Mutation(returns => User) 

  async createUser(@Args('data') data: CreateUserInput) {
    console.log("data",data)
    return this.userService.createUser(data);
  }
}
