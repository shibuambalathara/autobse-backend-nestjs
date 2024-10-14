import { registerEnumType } from "@nestjs/graphql";

export enum eventCategory{
    open="open",
    online="online"
}

registerEnumType(eventCategory, {
    name: 'eventCategory',
  });

export enum   EventBidLockType{
    Locked="locked",
    Unlocked="unlocked"
}

registerEnumType(EventBidLockType, {
    name: 'eventBidLockType',
  });

  export enum   EventStatusType{
    Pending ="pending",
    Blocked = "blocked",
    Active = "active",
    Inactive = "inactive",
    Stop = "stop",
    Pause = "pause"
}

registerEnumType(EventStatusType, {
    name: 'eventStatusType',
  });
