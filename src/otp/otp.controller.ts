import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OtpService } from './otp.service';
import { SendOtpDto } from './dto/send-otp.dto';
import { UpdateOtpDto } from './dto/update-otp.dto';
import { VerfiyOtpDto } from './dto/verify-otp.dto';

@Controller('api/v1/otp')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @Post('send')
  send(@Body() sendOtpDto: SendOtpDto) {
    return this.otpService.sendOtp(sendOtpDto)
  }

  @Post('verify')
  verify(@Body() verfiyOtpDto: VerfiyOtpDto) {
    return this.otpService.verifyOtp(verfiyOtpDto)
  }

}
