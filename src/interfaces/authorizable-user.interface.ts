type RequireAtLeastOne<T, Keys extends keyof T = keyof T> =
  Pick<T, Exclude<keyof T, Keys>>
  & {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>
  }[Keys]


interface AuthorizableUserRolesNotRequired<Role, Id> {
  id: Id;
  roles?: Array<Role>;
  role?: Role;
}

export type AuthorizableUser<Role = string, Id = string> = RequireAtLeastOne<AuthorizableUserRolesNotRequired<Role, Id>, 'roles' | 'role'>
