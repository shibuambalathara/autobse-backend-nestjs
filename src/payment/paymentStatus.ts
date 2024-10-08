import { registerEnumType } from '@nestjs/graphql';


export enum PaymentType {
  registrations="registrations",
  emd="emd",
  openBids="openBids",
}
registerEnumType(PaymentType, {
  name: 'PaymentType',
});

export enum PaymentStatusTypes {
    pending="pending",
    approved="approved",
    rejected="rejected",
  }
  registerEnumType(PaymentStatusTypes, {
    name: 'PaymentStatusType',
  });
