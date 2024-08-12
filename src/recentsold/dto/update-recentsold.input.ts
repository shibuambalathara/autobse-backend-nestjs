import { CreateRecentsoldInput } from './create-recentsold.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateRecentsoldInput extends PartialType(CreateRecentsoldInput) {
  @Field()
  image?: string;

  @Field()
  vehicleName?: string;

  @Field()
  location?: string;

  @Field()
  soldDate?: Date;
}
