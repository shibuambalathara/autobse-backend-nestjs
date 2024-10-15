import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { AuthResolver } from './auth.resolver';
import { UserModule } from '../user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    PassportModule,
    // JwtModule.register({
    //   secret: process.env.JWT_SECRET_KEY,
    //   signOptions: { expiresIn: '7d' },
    // }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async(configService: ConfigService) => ({
      secret: configService.get<string>('JWT_SECRET_KEY'),
      signOptions: { expiresIn: '7d' },
      }),
      inject:[ConfigService]
    }),
    UserModule,
  ],
  providers: [AuthService, JwtStrategy, AuthResolver],
  exports: [AuthService],
})
export class AuthModule {}
