import { registerEnumType } from "@nestjs/graphql";

export enum VehicleBidStatusType{
    pending="pending",
    approved="approved",
    fulfilled="pending",
    declined="declined"
}

registerEnumType(VehicleBidStatusType , {
    name: 'VehicleBidStatusType'
  });


