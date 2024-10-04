import { registerEnumType } from '@nestjs/graphql';

export enum ContactUsStatusType {
    created = 'created',
    solved = 'solved',
  }

registerEnumType(ContactUsStatusType, {
  name: 'ContactUsStatusType',
});