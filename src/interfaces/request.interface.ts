import { AuthorizableUser } from './authorizable-user.interface';
import { CaslRequestCache } from './casl-request-cache.interface';

export interface AuthorizableRequest<User = AuthorizableUser, Subject = any> {
  user?: User;
  currentUser?: User;
  casl: CaslRequestCache<User, Subject>;
  [key: string]: any;
}

export interface ContextWithAuthorizableRequest {
  req: AuthorizableRequest;
}
