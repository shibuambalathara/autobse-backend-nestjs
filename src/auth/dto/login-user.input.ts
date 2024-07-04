import { InputType, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class LoginUserInput {
  @Field()
  @IsString()
  mobile:string;

  @Field()
  @IsString()
  password: string;
}
