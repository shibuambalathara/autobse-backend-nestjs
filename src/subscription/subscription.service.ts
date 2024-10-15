import { Injectable } from '@nestjs/common';

@Injectable()
export class SubscriptionService {

  findAll() {
    return `This action returns all subscription`;
  }

  findOne(id: number) {
    return `This action returns a #${id} subscription`;
  }
}
