import { AnyClass } from '@casl/ability/dist/types/types';

import { UserBeforeFilterHook, UserBeforeFilterTuple } from './hooks.interface';
import { AnyPermissions } from './permissions.interface';
import { AuthorizableUser } from './authorizable-user.interface';
import { AuthorizableRequest } from './request.interface';

export interface OptionsForRoot<Roles = string, User = AuthorizableUser<Roles>, Request = AuthorizableRequest<User>> {
  superuserRole?: Roles;
  getUserFromRequest?: (request: Request) => User | undefined;
  getUserHook?: AnyClass<UserBeforeFilterHook<User>> | UserBeforeFilterTuple<User>;
}

export interface OptionsForFeature {
  permissions: AnyPermissions;
}
