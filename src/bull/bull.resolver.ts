import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { BullBoardService } from './bullboard.service';
import { Bull } from './entities/bull.entity';
import { CreateBullInput } from './dto/create-bull.input';
import { UpdateBullInput } from './dto/update-bull.input';
import { Vehicle } from 'src/vehicle/models/vehicle.model';

@Resolver(() => Bull)
export class BullResolver {
  constructor(private readonly bullService: BullBoardService) {}

  // @Query(() => Vehicle)
  // getRouter() {
  //   return this.bullService.getRouter();
  }
  // createBull(@Args('createBullInput') createBullInput: CreateBullInput) {
  //   return this.bullService.create(createBullInput);
  // }

  // @Query(() => [Bull], { name: 'bull' })
  // findAll() {
  //   return this.bullService.findAll();
  // }

  // @Query(() => Bull, { name: 'bull' })
  // findOne(@Args('id', { type: () => Int }) id: number) {
  //   return this.bullService.findOne(id);
  // }

  // @Mutation(() => Bull)
  // updateBull(@Args('updateBullInput') updateBullInput: UpdateBullInput) {
  //   return this.bullService.update(updateBullInput.id, updateBullInput);
  // }

  // @Mutation(() => Bull)
  // removeBull(@Args('id', { type: () => Int }) id: number) {
  //   return this.bullService.remove(id);
  // }
// }
