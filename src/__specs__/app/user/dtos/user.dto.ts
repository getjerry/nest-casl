import { Field, ObjectType } from '@nestjs/graphql';
import { AuthorizableUser } from '../../../../interfaces/authorizable-user.interface';

@ObjectType()
export class User implements AuthorizableUser {
  @Field()
  id!: string;

  roles!: string[]

  name?: string;
}
