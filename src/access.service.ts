import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Ability, AnyAbility, subject } from '@casl/ability';
import { AnyObject, Subject } from '@casl/ability/dist/types/types';

import { AuthorizableRequest } from './interfaces/request.interface';
import { AbilityFactory } from './factories/ability.factory';
import { AbilityMetadata } from './interfaces/ability-metadata.interface';
import { UserProxy } from './proxies/user.proxy';
import { CaslConfig } from './casl.config';
import { AuthorizableUser } from './interfaces/authorizable-user.interface';
import { RequestProxy } from './proxies/request.proxy';
import { ConditionsProxy } from './proxies/conditions.proxy';

@Injectable()
export class AccessService {
  constructor(private abilityFactory: AbilityFactory) {}

  public getAbility<User extends AuthorizableUser<string, unknown> = AuthorizableUser>(user: User): AnyAbility {
    return this.abilityFactory.createForUser(user);
  }

  public hasAbility<User extends AuthorizableUser<string, unknown> = AuthorizableUser>(
    user: User,
    action: string,
    subject: Subject,
    field?: string,
  ): boolean {
    // No user - no access
    if (!user) {
      return false;
    }

    // User exists but no ability metadata - deny access
    if (!action || !subject) {
      return false;
    }

    const { superuserRole } = CaslConfig.getRootOptions();
    const userAbilities = this.abilityFactory.createForUser(user);

    // Always allow access for superuser
    if (superuserRole && user.roles?.includes(superuserRole)) {
      return true;
    }

    return userAbilities.can(action, subject, field);
  }

  public assertAbility<User extends AuthorizableUser<string, unknown> = AuthorizableUser>(
    user: User,
    action: string,
    subject: Subject,
    field?: string,
  ): void {
    if (!this.hasAbility(user, action, subject, field)) {
      const userAbilities = this.abilityFactory.createForUser(user, Ability);
      const relatedRules = userAbilities.rulesFor(action, typeof subject === 'object' ? subject.constructor : subject);
      if (relatedRules.some((rule) => rule.conditions)) {
        throw new NotFoundException();
      }
      throw new UnauthorizedException();
    }
  }

  public async canActivateAbility<Subject = AnyObject>(
    request: AuthorizableRequest,
    ability?: AbilityMetadata<Subject>,
  ): Promise<boolean> {
    const { getUserFromRequest, superuserRole } = CaslConfig.getRootOptions();

    const userProxy = new UserProxy(request, getUserFromRequest);
    const req = new RequestProxy(request);

    // Attempt to get user from request
    const user = userProxy.getFromRequest();

    // No user - no access
    if (!user) {
      return false;
    }

    // User exists but no ability metadata - deny access
    if (!ability) {
      return false;
    }

    // Always allow access for superuser
    if (superuserRole && user.roles?.includes(superuserRole)) {
      return true;
    }

    let userAbilities = this.abilityFactory.createForUser(user, Ability);
    const relevantRules = userAbilities.rulesFor(ability.action, ability.subject);

    req.setConditions(new ConditionsProxy(userAbilities, ability.action, ability.subject));

    // If no relevant rules with conditions or no subject hook exists check against subject class
    if (!relevantRules.every((rule) => rule.conditions) || !ability.subjectHook) {
      return userAbilities.can(ability.action, ability.subject);
    }

    // Otherwise try to obtain subject
    const subjectInstance = await req.getSubjectHook().run(request);
    req.setSubject(subjectInstance);

    if (!subjectInstance) {
      return userAbilities.can(ability.action, ability.subject);
    }

    const finalUser = await userProxy.get();
    if (finalUser && finalUser !== userProxy.getFromRequest()) {
      userAbilities = this.abilityFactory.createForUser(finalUser);
    }

    // and match agains subject instance
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return userAbilities.can(ability.action, subject(ability.subject as any, subjectInstance));
  }
}
