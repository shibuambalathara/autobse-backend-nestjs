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


export enum vehicleEventStatus {
    completed = "completed",
    upcoming = "upcoming",
    live = "live",
    abnormal = "abnormal"
  }

registerEnumType(vehicleEventStatus , {
    name: 'vehicleEventStatus'
  });

