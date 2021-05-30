import { Injectable } from '@nestjs/common';
import { Ability, PureAbility, subject } from "@casl/ability";
import { CASL_ROOT_OPTIONS } from './casl.constants';
import { OptionsForRoot, RequestWithIdentity } from './interfaces/options.interface';

import { AbilityFactory } from './ability.factory';
import { AbilityMetadata } from './decorators/use-ability';
import { ConditionsProxy } from './conditions.proxy';

@Injectable()
export class AccessService {
  constructor(
    private abilityFactory: AbilityFactory,
  ) {}

  public getRootOptions(): OptionsForRoot {
    const rootOptions = Reflect.getMetadata(CASL_ROOT_OPTIONS, AccessService) as OptionsForRoot;
    if(!rootOptions.getUserFromRequest) {
      rootOptions.getUserFromRequest = (request) => request.user;
    }
    return rootOptions;
  }

  public hasAbility(request: RequestWithIdentity, ability?: Omit<AbilityMetadata, 'subjectHook'>): boolean {
    return false
  }

  public assertAbility(request: RequestWithIdentity, ability?: Omit<AbilityMetadata, 'subjectHook'>): void {
    return;
  }

  public async canActivateAbility(request: RequestWithIdentity, ability?: AbilityMetadata, hooks?: any): Promise<boolean> {
    const { getUserFromRequest, superuserRole } = this.getRootOptions();

    // Attempt to get user from request
    const user = getUserFromRequest && getUserFromRequest(request);
    request.caslUser = user;

    // No user - no access
    if (!user) {
      return false;
    }

    // User exists but no ability metadata - allow access
    if (!ability) {
      return true;
    }

    // Alway allow access for superuser
    if (superuserRole && user.roles.includes(superuserRole)) {
      return true;
    }

    // for abilities without subject hook use PureAbility to bypass condition check
    let userAbilities = this.abilityFactory.createForUser(user, ability.subjectHook ? Ability : PureAbility);

    const relevantRules = userAbilities.rulesFor(ability.action, ability.subject);

    // If no relevant rules with conditions or no subject hook exists check against subject class
    if (!relevantRules.every((rule) => rule.conditions) || !ability.subjectHook) {
      // TODO implement proxy
      request.caslConditions = new ConditionsProxy();
      return userAbilities.can(ability.action, ability.subject);
    }

    // Otherwise try to obtain subject
    request.caslSubject = await hooks.subject.run(request)

    // do not call user hook when no subject hook present
    // TODO spec it should pass without subject with conditions available through @CaslConditions() param
    if(ability.subjectHook) {
      const augmentedUser = await hooks.user.run(request)
      if (augmentedUser) {
        request.caslUser = augmentedUser;
        // when user received recreate ability factory with new data
        userAbilities = this.abilityFactory.createForUser(augmentedUser);
      }
    }

    // and match agains subject instance
    return userAbilities.can(ability.action, subject(ability.subject as any, request.caslSubject))
  }
}
