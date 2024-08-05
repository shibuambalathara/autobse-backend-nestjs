import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { RecentsoldService } from './recentsold.service';
import { Recentsold } from './models/recentsold.model';
import { CreateRecentsoldInput } from './dto/create-recentsold.input';
import { UpdateRecentsoldInput } from './dto/update-recentsold.input';
import { RecentSold } from '@prisma/client';
import { GqlAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/role/role.guard';
import { UseGuards } from '@nestjs/common';
import { Roles } from 'src/role/role.decorator';
import { RecentsoldWhereUniqueInput } from './dto/unique-recentsold.input';

@Resolver(() => Recentsold)
export class RecentsoldResolver {
  constructor(private readonly recentsoldService: RecentsoldService) {}
 

  @Mutation(returns => Recentsold)
  @UseGuards(GqlAuthGuard,RolesGuard)
  @Roles('admin')
  async createRecentsold(@Args('createRecentsoldInput') createRecentsoldInput: CreateRecentsoldInput):Promise<RecentSold> {
    return this.recentsoldService.createRecentsold(createRecentsoldInput);
  }

  
  @Query(returns => [Recentsold])
  async recentSolds():Promise<RecentSold []|null> {
    return this.recentsoldService.recentSolds();
  }



  @Mutation(returns => Recentsold)
  @UseGuards(GqlAuthGuard,RolesGuard)
  @Roles('admin')
  async updateRecentsold(@Args('where') where:RecentsoldWhereUniqueInput,@Args('updateRecentsoldInput') updateRecentsoldInput: UpdateRecentsoldInput):Promise<RecentSold|null> {
    return this.recentsoldService.updateRecentsold(where.id, updateRecentsoldInput);
  }

  @Mutation(returns => Recentsold)
  @UseGuards(GqlAuthGuard,RolesGuard)
  @Roles('admin')
  async deleteRecentsold(@Args('where') where:RecentsoldWhereUniqueInput) {
    return this.recentsoldService.deleteRecentsold(where.id);
  }
}
