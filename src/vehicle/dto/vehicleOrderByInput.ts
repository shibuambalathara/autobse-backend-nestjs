import { Field, InputType } from "@nestjs/graphql";
import { OrderDirection } from "src/common/order-direction";

@InputType()
export class VehicleOrderByInput {
  @Field(() => OrderDirection, { nullable: true })
  bidTimeExpire?: OrderDirection;

  
}