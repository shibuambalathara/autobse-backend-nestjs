import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginResponse } from './dto/login-response.dto';
import { LoginUserInput } from './dto/login-user.input';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(returns => LoginResponse)
  async login(@Args('loginUserInput') loginUserInput: LoginUserInput) {

    const user = await this.authService.validateUser(loginUserInput.mobile, loginUserInput.password);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    return this.authService.login(user);
  }
}
