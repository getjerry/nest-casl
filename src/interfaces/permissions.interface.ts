import { Ability, AbilityBuilder } from '@casl/ability';
import { AnyClass } from '@casl/ability/dist/types/types';

import { AuthorizableUser } from './authorizable-user.interface';
import { DefaultActions } from '../actions.enum';

export class UserAbilityBuilder<
  Subjects = any,
  Actions extends string = DefaultActions,
  User extends AuthorizableUser = AuthorizableUser
> extends AbilityBuilder<Ability> {
  constructor(
    public user: User,
    public permissions: AnyPermissions,
    AbilityType: AnyClass<Ability<[Actions, Subjects]>>
  ) {
    super(AbilityType);
  }

  extend = (role: string) => {
    this.permissionsFor(role);
  };

  permissionsFor(role: string) {
    const rolePermissions = this.permissions[role] as Function;
    if (rolePermissions) {
      rolePermissions(this);
    }
  }
}

export type DefinePermissions<
  Subjects = any,
  Actions extends string = DefaultActions,
  User extends AuthorizableUser = AuthorizableUser
> = (builder: UserAbilityBuilder<Subjects, Actions, User>) => void;

export type Permissions<
  Roles extends string,
  Subjects = any,
  Actions extends string = DefaultActions,
  User extends AuthorizableUser = AuthorizableUser
> = Partial<
  Record<Roles | 'every' | 'everyone', DefinePermissions<Subjects, Actions, User>>
>;

export type AnyPermissions = Permissions<any, any, any, AuthorizableUser>;
