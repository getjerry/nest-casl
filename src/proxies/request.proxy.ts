import { AuthorizableRequest } from "../interfaces/request.interface";
import { CaslRequestCache } from "../interfaces/casl-request-cache.interface";
import { AuthorizableUser } from "../interfaces/authorizable-user.interface";
import { SubjectBeforeFilterHook, UserBeforeFilterHook } from "../interfaces/hooks.interface";
import { NullSubjectHook } from '../factories/subject-hook.factory';
import { NullUserHook } from '../factories/user-hook.factory';
import { ConditionsProxy } from "./conditions.proxy";

export class RequestProxy<User = AuthorizableUser> {
  private readonly defaultCaslCache: CaslRequestCache<User> = {
    hooks: {
      subject: new NullSubjectHook(),
      user: new NullUserHook(),
    }
  }

  constructor(private request: AuthorizableRequest<User>) {
    this.request.casl = this.request.casl || this.defaultCaslCache as CaslRequestCache<User>;
  }

  public get cached(): CaslRequestCache<User> {
    return this.request.casl  as CaslRequestCache<User>;
  }

  public getConditions() {
    return this.cached.conditions;
  }

  public setConditions(conditions: ConditionsProxy) {
    return this.cached.conditions = conditions;
  }

  public getSubject() {
    return this.cached.subject;
  }

  public setSubject(subject: any) {
    return this.cached.subject = subject;
  }

  public getUser(): User | undefined {
    return this.cached.user;
  }

  public setUser(user: User | undefined) {
    return this.cached.user = user;
  }

  public getUserHook() {
    return this.cached.hooks.user;
  }

  public setUserHook(hook: UserBeforeFilterHook<User>) {
    return this.cached.hooks.user = hook;
  }

  public getSubjectHook() {
    return this.cached.hooks.subject;
  }

  public setSubjectHook(hook: SubjectBeforeFilterHook) {
    return this.cached.hooks.subject =  hook;
  }
}
