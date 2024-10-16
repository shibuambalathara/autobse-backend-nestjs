import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginResponse } from './dto/login-response.dto';
import { LoginUserInput } from '../auth/dto/login-user.input';
import {  UnauthorizedException } from '@nestjs/common';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => LoginResponse)
  async login(@Args('loginInput') loginInput: LoginUserInput) {
    const user = await this.authService.validateUser(loginInput.mobile, loginInput.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');  
      }
    return this.authService.login(user);
  }

// system time
@Query(()=>String)
async time(){
  return new Date().toISOString()
}

}
