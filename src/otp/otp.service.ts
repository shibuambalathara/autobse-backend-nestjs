import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { SendOtpDto } from './dto/send-otp.dto';
import { UpdateOtpDto } from './dto/update-otp.dto';
import { randomBytes } from 'crypto'
import { PrismaService } from 'src/prisma/prisma.service';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { ConfigService } from '@nestjs/config';
import { VerfiyOtpDto } from './dto/verify-otp.dto';

@Injectable()
export class OtpService {

  constructor(
    private readonly prismaService: PrismaService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) { }

  generateOtp(digits: number) {

    if (digits < 4 || digits > 8) {
      throw new InternalServerErrorException('Number of digits should be between 4 and 8.')
    }


    const min = Math.pow(10, digits - 1);  // Minimum value based on the number of digits
    const max = Math.pow(10, digits) - 1;  // Maximum value based on the number of digits

    // Generate a random number between min and max (inclusive) and convert it to string
    const otp = Math.floor(Math.random() * (max - min + 1)) + min;

    return otp.toString()

  }

  async sendOtp(sendOtpDto: SendOtpDto) {
    const otp = this.generateOtp(6)
    console.log(otp, 'its otp')
    const date = new Date()
    console.log(date);

    console.log(sendOtpDto.mobile);


    const setOtpToDb = await this.prismaService.user.update({
      where: {
        mobile: sendOtpDto.mobile,
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

    if (!setOtpToDb) throw new InternalServerErrorException('Failed to set otp.')

    const url = `https://sms.textspeed.in/vb/apikey.php?apikey=${this.configService.get<string>('OTP_API_KEY')}&senderid=${this.configService.get<string>('OTP_SENDER_ID')}&templateid=${this.configService.get<string>('OTP_TEMPLATE_ID')}&number=${setOtpToDb.mobile}&message=Use%20${setOtpToDb.otp}%20as%20one-time%20password%20(OTP)%20to%20login%20into%20AUTOBSE.com.%20Please%20do%20not%20share%20this%20OTP%20with%20anyone%20to%20ensure%20account%27s%20security.`
    console.log(url, 'url');


    const { data } = await firstValueFrom(
      this.httpService.get(url).pipe(
        catchError((error: AxiosError) => {
          console.log(error.response.data)
          throw new InternalServerErrorException(`Failed to send OTP. Error from SMS service: ${error.response.data || 'Unknown error'}`)
        }),
      )
    )

    console.log(data, 'got data');
    return data

  }

  async verifyOtp(verfiyOtpDto: VerfiyOtpDto) {
    const user = await this.prismaService.user.findUnique({
      where: {
        mobile: verfiyOtpDto.mobile,
      },
      select: {
        otp: true,
        otp_gen: true,
      }
    })
    if (!user) throw new NotFoundException('Mobile number doesnot exist.')
    if (verfiyOtpDto.otp !== user.otp) throw new ConflictException('Invalid otp.')
    const isOtpNotExpired = this.otpExpireLimit(1, user.otp_gen)
    if (!isOtpNotExpired) throw new ConflictException('Your otp expired.')
      return 'login'

  }

  async otpExpireLimit(minutes: number, otpGenDateTime: Date) {
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
