import { InputType, Int, Field, ID } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class UniqueVehicleInput {

  @Field({nullable:true})
  id?:string;

  @Field({nullable:true})
  vehicleIndexNo?:number;

}
