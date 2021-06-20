import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdatePostInput {
  @Field()
  id: string;

  @Field()
  userId: string;

  @Field({ nullable: true })
  title?: string;
}
