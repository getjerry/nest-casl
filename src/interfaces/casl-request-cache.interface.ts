import { SubjectBeforeFilterHook, UserBeforeFilterHook } from './hooks.interface';
import { AuthorizableUser } from './authorizable-user.interface';
import { ConditionsProxy } from '../proxies/conditions.proxy';



export interface CaslRequestCache<User = AuthorizableUser, Subject = any> {
  user?: User;
  subject?: Subject;
  conditions?: ConditionsProxy;
  hooks: {
    user: UserBeforeFilterHook<User>;
    subject: SubjectBeforeFilterHook<Subject>;
  };
}
