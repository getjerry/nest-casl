import { AnyClass } from '@casl/ability/dist/types/types';

import { SubjectBeforeFilterHook, UserBeforeFilterHook, UserBeforeFilterTuple } from './hooks.interface';
import { AnyPermissions } from './permissions.interface';
import { AuthorizableUser } from './authorizable-user.interface';
import { ConditionsProxy } from '../proxies/conditions.proxy';

export interface CaslRequestCache<Subject =  any> {
  user?: AuthorizableUser;
  subject?: Subject;
  conditions?: ConditionsProxy;
  hooks: {
    user: UserBeforeFilterHook;
    subject: SubjectBeforeFilterHook<Subject>;
  };
}

export interface AuthorizableRequest<User = AuthorizableUser, Subject = any> {
  id?: string;
  user?: User;
  currentUser?: User;
  casl: CaslRequestCache<Subject>;
  [key:string]: any;
}

export interface ContextWithAuthorizableRequest {
  req: AuthorizableRequest;
}

export interface OptionsForRoot<User = AuthorizableUser, Role = string> {
  superuserRole?: Role;
  getUserFromRequest?: (request: AuthorizableRequest<User>) => User | undefined;
  getUserHook?: AnyClass<UserBeforeFilterHook<User>> | UserBeforeFilterTuple;
}

export interface OptionsForFeature {
  permissions: AnyPermissions;
}
