import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateRecentsoldInput {
  @Field()
  image?: string;

  @Field()
  vehicleName?:string;

  @Field()
  location?:string;

  @Field()
  soldDate?:Date;

}
