import { AnyObject } from '@casl/ability/dist/types/types';

import { AuthorizableRequest } from '../interfaces/request.interface';
import { CaslRequestCache } from '../interfaces/casl-request-cache.interface';
import { AuthorizableUser } from '../interfaces/authorizable-user.interface';
import { SubjectBeforeFilterHook, UserBeforeFilterHook } from '../interfaces/hooks.interface';
import { NullSubjectHook } from '../factories/subject-hook.factory';
import { NullUserHook } from '../factories/user-hook.factory';
import { ConditionsProxy } from './conditions.proxy';

export class RequestProxy<User extends AuthorizableUser<unknown, unknown> = AuthorizableUser, Subject = AnyObject> {
  private readonly defaultCaslCache: CaslRequestCache<User, Subject> = {
    hooks: {
      subject: new NullSubjectHook(),
      user: new NullUserHook(),
    },
  };

  constructor(private request: AuthorizableRequest<User, Subject>) {
    this.request.casl = this.request.casl || (this.defaultCaslCache as CaslRequestCache<User, Subject>);
  }

  public get cached(): CaslRequestCache<User, Subject> {
    return this.request.casl as CaslRequestCache<User, Subject>;
  }

  public getConditions(): ConditionsProxy | undefined {
    return this.cached.conditions;
  }

  public setConditions(conditions: ConditionsProxy): void {
    this.cached.conditions = conditions;
  }

  public getSubject(): Subject | undefined {
    return this.cached.subject;
  }

  public setSubject(subject: Subject | undefined): void {
    this.cached.subject = subject;
  }

  public getUser(): User | undefined {
    return this.cached.user;
  }

  public setUser(user: User | undefined): void {
    this.cached.user = user;
  }

  public getUserHook(): UserBeforeFilterHook<User> {
    return this.cached.hooks.user;
  }

  public setUserHook(hook: UserBeforeFilterHook<User>): void {
    this.cached.hooks.user = hook;
  }

  public getSubjectHook(): SubjectBeforeFilterHook<Subject> {
    return this.cached.hooks.subject;
  }

  public setSubjectHook(hook: SubjectBeforeFilterHook<Subject>): void {
    this.cached.hooks.subject = hook;
  }
}
