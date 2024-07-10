import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service'; // Assume you have a UsersService
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(mobile: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByMobile(mobile);
    if (user && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
  
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { mobile: user?.mobile, sub: user?.id, roles: user?.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
