import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreatePostInput {
  @Field()
  userId: string;

  @Field({ nullable: true })
  title?: string;
}
