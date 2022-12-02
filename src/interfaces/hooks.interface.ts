import { AnyClass, AnyObject } from '@casl/ability/dist/types/types';

import { AuthorizableRequest } from './request.interface';
import { AuthorizableUser } from './authorizable-user.interface';

export interface SubjectBeforeFilterHook<
  Subject = AnyObject,
  Request = AuthorizableRequest<AuthorizableUser, Subject>,
> {
  run: (request: Request) => Promise<Subject | undefined>;
}

export type SubjectBeforeFilterTuple<Subject = AnyObject, Request = AuthorizableRequest> = [
  AnyClass,
  (service: InstanceType<AnyClass>, request: Request) => Promise<Subject>,
];

export interface UserBeforeFilterHook<
  User extends AuthorizableUser<unknown, unknown> = AuthorizableUser,
  RequestUser = User,
> {
  run: (user: RequestUser) => Promise<User | undefined>;
}

export type UserBeforeFilterTuple<
  User extends AuthorizableUser<unknown, unknown> = AuthorizableUser,
  RequestUser = User,
> = [AnyClass, (service: InstanceType<AnyClass>, user: RequestUser) => Promise<User>];
