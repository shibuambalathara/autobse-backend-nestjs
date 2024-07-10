import { IsString } from 'class-validator';
import { CreateVehiclecategoryInput } from './create-vehiclecategory.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateVehiclecategoryInput extends PartialType(CreateVehiclecategoryInput) {
  @Field({nullable:true})
  @IsString()
  name?: string;
}
