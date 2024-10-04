import { ObjectType, Field } from '@nestjs/graphql';
import { User } from 'src/user/models/user.model';

@ObjectType()
export class VerifyOtpResponse {
  @Field()
  access_token: string;
  @Field(() => User)
  user: User;
}