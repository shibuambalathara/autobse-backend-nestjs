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

export enum UserStatusType {
  pending="pending",
  blocked="blocked",
  active="active",
  inactive="inactive"
}
registerEnumType(UserStatusType, {
  name: 'UserStatusType',
});

export enum UserIdProofTypeType {
  Aadhar="aadhar",
  DrivingLicense="drivingLicense",
  Passport="passport"
}
registerEnumType(UserIdProofTypeType, {
  name: 'UserIdProofTypeType',
});