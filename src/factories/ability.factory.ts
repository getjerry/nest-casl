import { Ability, AnyAbility, PureAbility } from '@casl/ability';
import { SubjectType } from '@casl/ability/dist/types/types';
import { Inject, Injectable } from '@nestjs/common';
import { DefaultActions } from '../actions.enum';

import { OptionsForFeature } from '../interfaces/options.interface';
import { AuthorizableUser } from '../interfaces/authorizable-user.interface';
import { UserAbilityBuilder } from '../interfaces/permissions.interface';
import { CASL_FEATURE_OPTIONS } from '../casl.constants';

export const nullConditionsMatcher = () => (): boolean => true;

@Injectable()
export class AbilityFactory<Roles extends string = string, Subjects = SubjectType, Actions extends string = DefaultActions, User extends AuthorizableUser<Roles> = AuthorizableUser<Roles>> {
  constructor(
    @Inject(CASL_FEATURE_OPTIONS)
    private readonly featureOptions: OptionsForFeature<Roles, Subjects, Actions, User>,
  ) {}

  createForUser(user: User, abilityClass = Ability): AnyAbility {
    const { permissions } = this.featureOptions;
    const ability = new UserAbilityBuilder<Subjects, Actions, User>(user, permissions, abilityClass);
    const everyone = permissions['everyone'] || permissions['every'];

    if (everyone) {
      everyone(ability);
    }

    user.roles.forEach((role) => {
      ability.permissionsFor(role);
    });

    // For PureAbility skip conditions check, conditions will be available for filtering through @CaslConditions() param
    if (abilityClass === PureAbility) {
      return ability.build({ conditionsMatcher: nullConditionsMatcher });
    }
    return ability.build();
  }
}
