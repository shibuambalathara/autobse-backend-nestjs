import { Field, InputType } from "@nestjs/graphql";

@InputType()

export class OrderInput {
@Field(() => String)
sortOrder: 'asc' | 'desc';
}