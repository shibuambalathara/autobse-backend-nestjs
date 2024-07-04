import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { LocalStrategy } from './local.strategy';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: '60m' },
    }),
    UserModule,
  ],
  providers: [AuthService, AuthResolver, LocalStrategy],
})
export class AuthModule {}
