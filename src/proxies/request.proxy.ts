import { AnyObject } from '@casl/ability/dist/types/types';

import { AuthorizableRequest } from '../interfaces/request.interface';
import { CaslRequestCache } from '../interfaces/casl-request-cache.interface';
import { AuthorizableUser } from '../interfaces/authorizable-user.interface';
import { SubjectBeforeFilterHook, UserBeforeFilterHook } from '../interfaces/hooks.interface';
import { NullSubjectHook } from '../factories/subject-hook.factory';
import { NullUserHook } from '../factories/user-hook.factory';
import { ConditionsProxy } from './conditions.proxy';

export class RequestProxy<User = AuthorizableUser> {
  private readonly defaultCaslCache: CaslRequestCache<User> = {
    hooks: {
      subject: new NullSubjectHook(),
      user: new NullUserHook(),
    },
  };

  constructor(private request: AuthorizableRequest<User>) {
    this.request.casl = this.request.casl || (this.defaultCaslCache as CaslRequestCache<User>);
  }

  public get cached(): CaslRequestCache<User> {
    return this.request.casl as CaslRequestCache<User>;
  }

  public getConditions(): ConditionsProxy | undefined {
    return this.cached.conditions;
  }

  public setConditions(conditions: ConditionsProxy): void {
    this.cached.conditions = conditions;
  }

  public getSubject(): AnyObject | undefined {
    return this.cached.subject;
  }

  public setSubject(subject: AnyObject | undefined): void {
    this.cached.subject = subject;
  }

  public getUser(): User | undefined {
    return this.cached.user;
  }

  public setUser(user: User | undefined): void {
    this.cached.user = user;
  }

  public getUserHook(): UserBeforeFilterHook<User> | undefined {
    return this.cached.hooks.user;
  }

  public setUserHook(hook: UserBeforeFilterHook<User>): void {
    this.cached.hooks.user = hook;
  }

  public getSubjectHook(): SubjectBeforeFilterHook {
    return this.cached.hooks.subject;
  }

  public setSubjectHook(hook: SubjectBeforeFilterHook): void {
    this.cached.hooks.subject = hook;
  }
}
