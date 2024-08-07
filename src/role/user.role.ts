import { registerEnumType } from '@nestjs/graphql';

export enum UserRoleType {
    admin = 'admin',
    staff = 'staff',
    seller = 'seller',
    dealer = 'dealer'
  }

registerEnumType(UserRoleType, {
  name: 'UserRoleType',
});