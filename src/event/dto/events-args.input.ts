import { Field, InputType } from "@nestjs/graphql";
import { EventWhereUniqueInput } from "./unique-event.input";

@InputType()
export class Arguments {
  @Field(() => EventWhereUniqueInput, { nullable: true })
  where?: EventWhereUniqueInput;
}