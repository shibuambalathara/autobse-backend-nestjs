import { registerEnumType } from '@nestjs/graphql';


export enum PaymentType {
  Registrations="registrations",
  Emd="emd",
  OpenBids="openBids",
}
registerEnumType(PaymentType, {
  name: 'PaymentType',
});

export enum PaymentStatusTypes {
    Pending="pending",
    Approved="approved",
    Rejected="rejected",
  }
  registerEnumType(PaymentStatusTypes, {
    name: 'PaymentStatusType',
  });
