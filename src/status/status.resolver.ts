import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { StatusService } from './status.service';
import { Status } from './models/status.model';
import { CreateStatusInput } from './dto/create-status.input';
import { UpdateStatusInput } from './dto/update-status.input';
import { StatusWhereUniqueInput } from './dto/unique-status.input';
import { GqlAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/role/role.guard';
import { UseGuards } from '@nestjs/common';
import { Roles } from 'src/role/role.decorator';

@Resolver(() => Status)
export class StatusResolver {
  constructor(private readonly statusService: StatusService) {}

  
  @UseGuards(GqlAuthGuard,RolesGuard)
  @Roles('admin', 'staff')
  @Mutation(returns => Status)
  async createStatus(@Args('createStatusInput') createStatusInput: CreateStatusInput, @Context() context):Promise<Status|null> {
    const {id}=context.req.user 
    return this.statusService.createStatus(id,createStatusInput);
  }


  @Query(returns => [Status])
  async statuses():Promise<Status[]|null> {
    return this.statusService.statuses();
  }

  @Query(returns => Status)
  async status(@Args('where') where:StatusWhereUniqueInput):Promise<Status|null> {
    return this.statusService.status(where);
  }

  
  @UseGuards(GqlAuthGuard,RolesGuard)
  @Roles('admin')
  @Mutation(returns => Status)
  async updateStatus(@Args('where') where:StatusWhereUniqueInput,@Args('updateStatusInput') updateStatusInput: UpdateStatusInput):Promise<Status|null> {
    return this.statusService.updateStatus(where.id,updateStatusInput);
  }

  
  @UseGuards(GqlAuthGuard,RolesGuard)
  @Roles('admin')
  @Mutation(returns => Status)
  async deleteStatus(@Args('where') where:StatusWhereUniqueInput ):Promise<Status|null> {
    return this.statusService.deleteStatus(where.id);
  }


  @UseGuards(GqlAuthGuard,RolesGuard)
  @Roles('admin')
  @Query(returns => [Status])
  async deletedStatuses(){
    return this.statusService.deletedStatuses();
  }

  @Query(returns => Status)
  @UseGuards(GqlAuthGuard,RolesGuard)
  @Roles('admin')
  async deletedStatus(@Args('where') where:StatusWhereUniqueInput):Promise<Status|null>{
    return this.statusService.deletedStatus(where.id);
  }

  @Mutation(returns=>Status)
  @UseGuards(GqlAuthGuard,RolesGuard)
  @Roles('admin')
  async restoreStatus(@Args('where') where:StatusWhereUniqueInput):Promise<Status|null>{
    return this.statusService.restoreStatus(where);
  }
}
