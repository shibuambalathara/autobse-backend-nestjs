import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './models/user.model';
import { CreateUserInput } from './dto/create-user.input';
import { UserWhereUniqueInput } from './dto/user-where.input';
import { UpdateUserInput } from './dto/update-user.input';

@Resolver((of) => User)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query((returns) => [User], { nullable: 'items' })
  async users(): Promise<User[] | null> {
    return this.userService.getAllUsers();
  }

  @Query((returns) => User, { nullable: true })
  async user(
    @Args('where', { type: () => UserWhereUniqueInput })
    where: UserWhereUniqueInput,
  ): Promise<User | null> {
    if (!where.id && !where.mobile && !where.tempToken && !where.idNo) {
      throw new Error('At least one unique identifier must be provided');
    }

    return this.userService.getUserByConditions(where);
  }
  @Query((returns) => User, { nullable: true })
  async deletedUser(
    @Args('where') where: UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.userService.deletedUser(where);
  }
  @Query((returns) => [User], { nullable: 'items' })
  async deletedUsers(): Promise<User[] | null> {
    return this.userService.allDeletedUsers();
  }
  @Mutation((returns) => User)
  async createUser(@Args('data') data: CreateUserInput) {
    return this.userService.createUser(data);
  }
  @Mutation((returns) => User)
  async updateUser(
    @Args('data') data: UpdateUserInput,
    @Args('where') where: UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.userService.updateUserField(data, where);
  }
  @Mutation((returns) => User)
  async deleteUser(
    @Args('where') where: UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.userService.deleteUser(where);
  }
}
