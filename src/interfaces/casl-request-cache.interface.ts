import { SubjectBeforeFilterHook, UserBeforeFilterHook } from './hooks.interface';
import { AuthorizableUser } from './authorizable-user.interface';
import { ConditionsProxy } from '../proxies/conditions.proxy';



export interface CaslRequestCache<Subject = any> {
  user?: AuthorizableUser;
  subject?: Subject;
  conditions?: ConditionsProxy;
  hooks: {
    user: UserBeforeFilterHook;
    subject: SubjectBeforeFilterHook<Subject>;
  };
}
