import { InputType, Int, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class CreateVehiclecategoryInput {
  @Field()
  @IsString()
  name:string;
}
