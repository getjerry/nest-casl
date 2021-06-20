import { AnyClass } from '@casl/ability/dist/types/types';
import { AuthorizableRequest } from "./request.interface";
import { AuthorizableUser } from './authorizable-user.interface';

export interface SubjectBeforeFilterHook<Subject = any, Request = AuthorizableRequest> {
  run: (request: Request) => Promise<Subject | undefined>;
}

export type SubjectBeforeFilterTuple<Service = any, Subject = any, Request = AuthorizableRequest> = [
  AnyClass<Service>,
  (service: Service, request: Request) => Promise<Subject>,
];

export interface UserBeforeFilterHook<User = AuthorizableUser, RequestUser = User> {
  run: (user: RequestUser) => Promise<User | undefined>;
}

export type UserBeforeFilterTuple<Service = any, User = AuthorizableUser, RequestUser = User> = [
  AnyClass<Service>,
  (service: Service, user: RequestUser) => Promise<User>,
];
