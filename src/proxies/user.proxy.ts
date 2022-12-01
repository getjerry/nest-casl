import { AuthorizableRequest } from '../interfaces/request.interface';
import { AuthorizableUser } from '../interfaces/authorizable-user.interface';
import { RequestProxy } from './request.proxy';

export class UserProxy<User extends AuthorizableUser<unknown, unknown> = AuthorizableUser> {
  constructor(
    private request: AuthorizableRequest<User>,
    private getUserFromRequest: (request: AuthorizableRequest<User>) => User | undefined,
  ) {}

  public async get(): Promise<User | undefined> {
    return (await this.getFromHook()) || this.getFromRequest() || undefined;
  }

  public getFromRequest(): User | undefined {
    return this.getUserFromRequest(this.request);
  }

  public async getFromHook(): Promise<User | undefined> {
    const req = this.getRequest();
    const requestUser = this.getFromRequest();

    if (req.getUser()) {
      return req.getUser();
    }

    if (!requestUser) {
      return undefined;
    }

    req.setUser(await req.getUserHook().run(requestUser));
    return req.getUser();
  }

  private getRequest() {
    return new RequestProxy(this.request);
  }
}
