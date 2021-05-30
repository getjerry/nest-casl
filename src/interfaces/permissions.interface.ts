import { Ability, AbilityBuilder } from '@casl/ability';
import { AnyClass } from '@casl/ability/dist/types/types';

import { UserIdentity } from './user-identity.interface';

export enum DefaultActions {
  read = 'read',
  aggregate = 'aggregate',
  create = 'create',
  update = 'update',
  delete = 'delete',
  manage = 'manage',
}

export type Actions = DefaultActions;
export const Actions = DefaultActions;

export class UserAbilityBuilder<
  Subjects = any,
  Actions extends string = DefaultActions,
  User extends UserIdentity = UserIdentity
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
  User extends UserIdentity = UserIdentity
> = (builder: UserAbilityBuilder<Subjects, Actions, User>) => void;

export type Permissions<
  Roles extends string,
  Subjects = any,
  Actions extends string = DefaultActions,
  User extends UserIdentity = UserIdentity
> = Partial<
  Record<Roles | 'every' | 'everyone', DefinePermissions<Subjects, Actions, User>>
>;

export type AnyPermissions = Permissions<any, any, any, UserIdentity>;
