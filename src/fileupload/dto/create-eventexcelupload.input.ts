import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateEventExcelUploadInput {
    @Field()
    eventId: string;


    @Field()
    name: string;
}
