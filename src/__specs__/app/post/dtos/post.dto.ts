import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Post {
  @Field()
  id: string;

  @Field()
  userId: string;

  @Field({ nullable: true })
  title?: string;
}
