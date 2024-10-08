import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { PrismaModule } from 'src/prisma/prisma.module';
import { s3Service } from 'src/services/s3/s3.service';

@Module({
  imports: [PrismaModule],
  providers: [UserService, UserResolver, s3Service],
  exports: [UserService],
})
export class UserModule {}
