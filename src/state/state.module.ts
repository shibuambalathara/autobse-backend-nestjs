import { Module } from '@nestjs/common';
// import { StateService } from './state.service';
// import { StateResolver } from './state.resolver';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  // providers: [StateResolver, StateService,PrismaService],
})
export class StateModule {}
