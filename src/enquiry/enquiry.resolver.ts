import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { EnquiryService } from './enquiry.service';
import { Enquiry } from './models/enquiry.model';
import { CreateEnquiryInput } from './dto/create-enquiry.input';
import { UpdateEnquiryInput } from './dto/update-enquiry.input';

@Resolver(() => Enquiry)
export class EnquiryResolver {
  constructor(private readonly enquiryService: EnquiryService) {}

  @Mutation(() => Enquiry)
  async createEnquiry(@Args('createEnquiryInput') createEnquiryInput: CreateEnquiryInput) {
    return this.enquiryService.createEnquiry(createEnquiryInput);
  }

  @Query(() => [Enquiry])
  findAll() {
    return this.enquiryService.findAll();
  }

  @Query(() => Enquiry, { name: 'enquiry' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.enquiryService.findOne(id);
  }

  @Mutation(() => Enquiry)
  updateEnquiry(@Args('updateEnquiryInput') updateEnquiryInput: UpdateEnquiryInput) {
    return this.enquiryService.update(updateEnquiryInput.id, updateEnquiryInput);
  }

  @Mutation(() => Enquiry)
  removeEnquiry(@Args('id', { type: () => Int }) id: number) {
    return this.enquiryService.remove(id);
  }
}
