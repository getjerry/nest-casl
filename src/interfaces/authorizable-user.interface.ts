export interface AuthorizableUser<Roles = string, Id = string | number> {
  id: Id;
  roles: Array<Roles>;
}
