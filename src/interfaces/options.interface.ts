import { AnyClass } from '@casl/ability/dist/types/types';
import { ConditionsProxy } from '../conditions.proxy';
import { BeforeFilterHook } from './hooks.interface';
import { AnyPermissions } from './permissions.interface';
import { UserIdentity } from './user-identity.interface';

export interface RequestWithIdentity<User = UserIdentity, Subject = any> {
  id: string;
  user: User;
  caslUser?: User;
  caslSubject: Subject;
  caslConditions: ConditionsProxy;
}

export interface ContextWithIdentity {
  req: RequestWithIdentity;
}

export interface OptionsForRoot<U = UserIdentity> {
  superuserRole?: string;

  getUserFromRequest?: (request: RequestWithIdentity) => UserIdentity;

  getUserHook?: AnyClass<BeforeFilterHook<U>>;
}

export interface OptionsForFeature {
  permissions: AnyPermissions;
}
