import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { EnquiryService } from './enquiry.service';
import { Enquiry } from './models/enquiry.model';
import { CreateEnquiryInput } from './dto/create-enquiry.input';
import { UpdateEnquiryInput } from './dto/update-enquiry.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/role/role.guard';
import { Roles } from 'src/role/role.decorator';
import { EnquiryWhereUniqueInput } from './dto/unique-enquiry-input';

@Resolver(() => Enquiry)
export class EnquiryResolver {
  constructor(private readonly enquiryService: EnquiryService) {}

  @Mutation(() => Enquiry)
  async createEnquiry(@Args('createEnquiryInput') createEnquiryInput: CreateEnquiryInput) {
    return this.enquiryService.createEnquiry(createEnquiryInput);
  }

  @Query(() => [Enquiry])
  @UseGuards(GqlAuthGuard,RolesGuard)
  @Roles('admin')
  async Enquiries() {
    return this.enquiryService.Enquiries();
  }

  @Query(() => Enquiry)
  @UseGuards(GqlAuthGuard,RolesGuard)
  @Roles('admin')
  async Enquiry(@Args('where') where:EnquiryWhereUniqueInput) {
    return this.enquiryService.Enquiry(where);
  }

  @Mutation(() => Enquiry)
  @UseGuards(GqlAuthGuard,RolesGuard)
  @Roles('admin')
  updateEnquiry(@Args('where') where:EnquiryWhereUniqueInput,@Args('updateEnquiryInput') updateEnquiryInput: UpdateEnquiryInput) {
    return this.enquiryService.updateEnquiry(where.id, updateEnquiryInput);
  }

  @Mutation(returns => Enquiry)
  @UseGuards(GqlAuthGuard,RolesGuard)
  @Roles('admin')
  async deleteEnquiry(@Args('where') where: EnquiryWhereUniqueInput):Promise<Enquiry|null> {
    return this.enquiryService.deleteEnquiry(where.id);
  }
  
  @Query(returns => [Enquiry])
  @UseGuards(GqlAuthGuard,RolesGuard)
  @Roles('admin')
  async deletedEnquiries():Promise<Enquiry[]|null>{
    return this.enquiryService.deletedEnquiries();
  }

  
  @Mutation(returns=>Enquiry)
  @UseGuards(GqlAuthGuard,RolesGuard)
  @Roles('admin')
  async restoreEnquiry(@Args('where') where:EnquiryWhereUniqueInput):Promise<Enquiry|null>{
    return this.enquiryService.restoreEnquiry(where);
  }
}
