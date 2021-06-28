import { Ability, AnyAbility, PureAbility } from '@casl/ability';
import { Inject, Injectable } from '@nestjs/common';

import { OptionsForFeature } from '../interfaces/options.interface';
import { AuthorizableUser } from '../interfaces/authorizable-user.interface';
import { UserAbilityBuilder } from '../interfaces/permissions.interface';
import { CASL_FEATURE_OPTIONS } from '../casl.constants';

export const nullConditionsMatcher = () => (): boolean => true;

@Injectable()
export class AbilityFactory {
  constructor(
    @Inject(CASL_FEATURE_OPTIONS)
    private readonly featureOptions: OptionsForFeature,
  ) {}

  createForUser(user: AuthorizableUser, abilityClass = Ability): AnyAbility {
    const { permissions } = this.featureOptions;
    const ability = new UserAbilityBuilder(user, permissions, abilityClass);
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
