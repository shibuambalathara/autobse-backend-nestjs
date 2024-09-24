import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { OtpService } from './otp.service';
import { Otp } from './entities/otp.entity';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerfiyOtpDto } from './dto/verify-otp.dto';
import { VerifyOtpResponse } from './dto/verify-otp.res.dto';
import { SendOtpResponse } from './dto/send-otp.res.dto';

@Resolver(() => Otp)
export class OtpResolver {
  constructor(private readonly otpService: OtpService) { }

  @Mutation(() => SendOtpResponse)
  sendOtp(@Args('sendOtpDto') sendOtpDto: SendOtpDto) {
    return this.otpService.sendOtp(sendOtpDto)
  }

  @Mutation(() => VerifyOtpResponse)
  verifyOtp(@Args('verfiyOtpDto') verfiyOtpDto: VerfiyOtpDto) {
    return this.otpService.verifyOtp(verfiyOtpDto)
  }

}
