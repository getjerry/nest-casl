import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Ability, PureAbility, subject } from "@casl/ability";

import { AuthorizableRequest } from './interfaces/options.interface';
import { AbilityFactory } from './factories/ability.factory';
import { AbilityMetadata } from './decorators/use-ability';
import { UserProxy } from './proxies/user.proxy';
import { CaslConfig } from './casl.config';
import { AuthorizableUser } from './interfaces/authorizable-user.interface';
import { RequestProxy } from './proxies/request.proxy';
import { ConditionsProxy } from './proxies/conditions.proxy';

@Injectable()
export class AccessService {
  constructor(
    private abilityFactory: AbilityFactory,
  ) {}

  public hasAbility(user: AuthorizableUser, action: string, subject: any): boolean {
    const { superuserRole } = CaslConfig.getRootOptions();
    let userAbilities = this.abilityFactory.createForUser(user);

    // No user - no access
    if (!user) {
      return false;
    }

    // User exists but no ability metadata - allow access
    if (!action || !subject) {
      return true;
    }

    // Always allow access for superuser
    if (superuserRole && user.roles.includes(superuserRole)) {
      return true;
    }
    
    return userAbilities.can(action, subject);
  }

  public assertAbility(user: AuthorizableUser, action: string, subject: any): void {
    if (!this.hasAbility(user, action, subject)) {
      throw new UnauthorizedException();
    }
  }

  public async canActivateAbility(request: AuthorizableRequest, ability?: AbilityMetadata): Promise<boolean> {
    const { getUserFromRequest, superuserRole } = CaslConfig.getRootOptions();

    const userProxy = new UserProxy(request, getUserFromRequest);
    const req = new RequestProxy(request);

    // Attempt to get user from request
    const user = userProxy.getFromRequest();

    // No user - no access
    if (!user) {
      return false;
    }

    // User exists but no ability metadata - allow access
    if (!ability) {
      return true;
    }

    // Always allow access for superuser
    if (superuserRole && user.roles.includes(superuserRole)) {
      return true;
    }

    // for abilities without subject hook use PureAbility to bypass condition check
    let userAbilities = this.abilityFactory.createForUser(user, ability.subjectHook ? Ability : PureAbility);

    const relevantRules = userAbilities.rulesFor(ability.action, ability.subject);

    const conditions = relevantRules.filter((rule) => rule.conditions).map((rule) => (rule.conditions || {}));
    req.setConditions(new ConditionsProxy(conditions));

    // If no relevant rules with conditions or no subject hook exists check against subject class
    if (!relevantRules.every((rule) => rule.conditions) || !ability.subjectHook) {
      return userAbilities.can(ability.action, ability.subject);
    }

    // Otherwise try to obtain subject
    const subjectInstance = await req.getSubjectHook().run(request);
    req.setSubject(subjectInstance);

    if(!subjectInstance) {
      return userAbilities.can(ability.action, ability.subject);
    }

    const finalUser = await userProxy.get();
    if(finalUser !== userProxy.getFromRequest()) {
      userAbilities = this.abilityFactory.createForUser(finalUser);
    }

    // and match agains subject instance
    return userAbilities.can(ability.action, subject(ability.subject as any, subjectInstance))
  }
}
