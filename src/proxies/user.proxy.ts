import { AuthorizableRequest } from "../interfaces/request.interface";
import { AuthorizableUser } from "../interfaces/authorizable-user.interface";
import { RequestProxy } from "./request.proxy";

export class UserProxy {
  constructor(private request: AuthorizableRequest, private getUserFromRequest: any) {}

  public async get() {
    return await this.getFromHook() || this.getFromRequest() || undefined;
  }

  public getFromRequest() {
    return this.getUserFromRequest(this.request);
  }

  public async getFromHook(): Promise<AuthorizableUser | undefined> {
    const req = this.getRequest();

    if (req.getUser()) {
      return req.getUser();
    }

    req.setUser(await req.getUserHook().run(this.getFromRequest()));
    return req.getUser();
  }

  private getRequest() {
    return new RequestProxy(this.request);
  }
}
