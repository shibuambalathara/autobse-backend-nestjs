import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { EmdupdateService } from './emdupdate.service';
import { Emdupdate } from './models/emdupdate.model';
import { CreateEmdupdateInput } from './dto/create-emdupdate.input';
import { UpdateEmdupdateInput } from './dto/update-emdupdate.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/role/role.guard';
import { Roles } from 'src/role/role.decorator';
import { EmdUpdate } from '@prisma/client';
import { EmdUpdateWhereUniqueInput } from './dto/unique-emdupdate';

@Resolver(() => Emdupdate)
export class EmdupdateResolver {
  constructor(private readonly emdupdateService: EmdupdateService) {}

  @Mutation(() => Emdupdate)
  @UseGuards(GqlAuthGuard,RolesGuard)
  @Roles('admin','staff')
  createEmdupdate(@Context() context,@Args('paymentId') paymentId:string,@Args('userId') userId:string,@Args('createEmdupdateInput') createEmdupdateInput: CreateEmdupdateInput,):Promise<EmdUpdate | null> {
    const {id}=context.req.user
    return this.emdupdateService.createEmdUpdate(id,paymentId,userId,createEmdupdateInput);
  }

  @Query(() => [Emdupdate])
  @UseGuards(GqlAuthGuard,RolesGuard)
  emdUpdates() :Promise<EmdUpdate []| null>{
    return this.emdupdateService.emdUpdates();
  }

  @Query(() => Emdupdate)
  emdUpdate( @Args('where') where:EmdUpdateWhereUniqueInput): Promise<EmdUpdate | null> {
    return this.emdupdateService.emdUpdate(where);
  }

  @Mutation(() => Emdupdate)
  @UseGuards(GqlAuthGuard,RolesGuard)
  @Roles('admin','staff')
  updateEmdupdate( @Args('where') where:EmdUpdateWhereUniqueInput,@Args('updateEmdupdateInput') updateEmdupdateInput: UpdateEmdupdateInput): Promise<EmdUpdate | null> {
    return this.emdupdateService.updateEmd( where,updateEmdupdateInput);
  }

  @Mutation(() => Emdupdate)
  @UseGuards(GqlAuthGuard,RolesGuard)
  @Roles('admin','staff')
  deleteEmdupdate( @Args('where') where:EmdUpdateWhereUniqueInput): Promise<EmdUpdate | null> {
    return this.emdupdateService.deleteEmdupdate(where);
  }
}
