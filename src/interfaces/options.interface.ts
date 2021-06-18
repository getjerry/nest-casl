import { AnyClass } from '@casl/ability/dist/types/types';

import { UserBeforeFilterHook, UserBeforeFilterTuple } from './hooks.interface';
import { AnyPermissions } from './permissions.interface';
import { AuthorizableUser } from './authorizable-user.interface';
import { AuthorizableRequest } from './request.interface';

export interface OptionsForRoot<User = AuthorizableUser, Role = string> {
  superuserRole?: Role;
  getUserFromRequest?: (request: AuthorizableRequest<User>) => User | undefined;
  getUserHook?: AnyClass<UserBeforeFilterHook<User>> | UserBeforeFilterTuple;
}

export interface OptionsForFeature {
  permissions: AnyPermissions;
}
