import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { SendOtpDto } from './dto/send-otp.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { ConfigService } from '@nestjs/config';
import { VerfiyOtpDto } from './dto/verify-otp.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class OtpService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) { }

  async sendOtp(sendOtpDto: SendOtpDto) {
    const otp = this.generateOtp(4)
    const userExist = await this.prismaService.user.findUnique({
      where: {
        mobile: sendOtpDto.mobile,
      },
      select: {
        id: true,
      }
    })
    if (!userExist) throw new NotFoundException('User doesnot exist.')

    const setUserOtp = await this.prismaService.user.update({
      where: {
        id: userExist.id,
      },
      data: {
        otp: otp,
        otp_gen: new Date()
      },
      select: {
        otp: true,
        mobile: true,
      }
    })
    if (!setUserOtp) throw new InternalServerErrorException('Failed to set user otp.')

    const url = `https://sms.textspeed.in/vb/apikey.php?apikey=${this.configService.get<string>('OTP_API_KEY')}&senderid=${this.configService.get<string>('OTP_SENDER_ID')}&templateid=${this.configService.get<string>('OTP_TEMPLATE_ID')}&number=${setUserOtp.mobile}&message=Use%20${setUserOtp.otp}%20as%20one-time%20password%20(OTP)%20to%20login%20into%20AUTOBSE.com.%20Please%20do%20not%20share%20this%20OTP%20with%20anyone%20to%20ensure%20account%27s%20security.`
    const { data } = await firstValueFrom(
      this.httpService.get(url).pipe(
        catchError((error: AxiosError) => {
          console.log(error.response.data)
          throw new InternalServerErrorException(`Failed to send OTP. Error from SMS service: ${error.response.data || 'Unknown error'}`)
        }),
      )
    )
    return data
  }

  generateOtp(digits: number): string {
    if (digits < 4 || digits > 8) throw new InternalServerErrorException('Number of digits should be between 4 and 8.')
    const min = Math.pow(10, digits - 1)
    const max = Math.pow(10, digits) - 1
    const otp = Math.floor(Math.random() * (max - min + 1)) + min
    return otp.toString()
  }

  async verifyOtp(verfiyOtpDto: VerfiyOtpDto) {
    const user = await this.prismaService.user.findUnique({
      where: {
        mobile: verfiyOtpDto.mobile,
      },
      select: {
        id: true,
        mobile: true,
        role: true,
        otp: true,
        otp_gen: true,
      }
    })
    if (!user) throw new NotFoundException('User doesnot exist.')
    if (verfiyOtpDto.otp !== user.otp) throw new ConflictException('Invalid otp.')
    const isOtpNotExpired = this.otpExpireLimit(3, user.otp_gen)
    if (!isOtpNotExpired) throw new ConflictException('Your otp expired.')
    const payload = { mobile: user?.mobile, sub: user?.id, roles: user?.role }
    const access_token = this.jwtService.sign(payload)
    return {
      access_token,
      user: {
        id: user.id,
        mobile: user.mobile,
        role: user.role,
      }
    }
  }

  otpExpireLimit(minutes: number, otpGenDateTime: Date) {
    const otpGenDateTimeObject = new Date(otpGenDateTime)
    const otpGenDateTimeInMillis = otpGenDateTimeObject.valueOf()
    const currDateTimeInMillis = new Date().valueOf()
    const timeDifferenceInMillis = currDateTimeInMillis - otpGenDateTimeInMillis
    if (timeDifferenceInMillis < (minutes * 60 * 1000)) {
      return true
    } else {
      return false
    }
  }
}
