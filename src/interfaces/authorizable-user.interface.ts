export interface AuthorizableUser<Roles = string, Id = string> {
  id: Id;
  roles: Array<Roles>;
}
