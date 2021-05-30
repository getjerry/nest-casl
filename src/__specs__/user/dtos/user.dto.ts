import { Field, ObjectType } from '@nestjs/graphql';
import { UserIdentity } from '../../../interfaces/user-identity.interface';

@ObjectType()
export class User implements UserIdentity {
  @Field()
  id!: string;

  roles!: string[]

  name?: string;

}
