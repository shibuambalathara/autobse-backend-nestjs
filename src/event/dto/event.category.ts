import { registerEnumType } from "@nestjs/graphql";

export enum eventCategory{
    Open="open",
    Online="online"
}

registerEnumType(eventCategory, {
    name: 'eventCategory',
  });