import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}
  async validateUser(mobile:string,password:string):Promise<any>{
   
    const user=await this.userService.findOneByMobile(mobile)
  
    if (user && bcrypt.compareSync(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
  async login(user: User) {
    const payload = { mobile: user.mobile, sub: user.id, roles: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
