import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Vehicle } from 'src/vehicle/models/vehicle.model';

@ObjectType()
export class VehicleListResponse {
  @Field(() => [Vehicle])
  vehicles: Vehicle[];

  @Field(() => Int)
  vehiclesCount: number;
}
