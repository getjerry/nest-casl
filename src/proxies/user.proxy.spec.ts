import { CaslRequestCache } from '../interfaces/casl-request-cache.interface';
import { UserBeforeFilterHook } from '../interfaces/hooks.interface';
import { NullSubjectHook } from '../factories/subject-hook.factory';
import { NullUserHook } from '../factories/user-hook.factory';
import { UserProxy } from './user.proxy';

const expectedUser = { id: 'userId', roles: [] };

class UserHook implements UserBeforeFilterHook {
  public async run() {
    return expectedUser;
  }
}

describe('UserProxy', () => {
  const defaultCaslCache: CaslRequestCache = {
    hooks: {
      subject: new NullSubjectHook(),
      user: new NullUserHook(),
    },
  };

  describe('get()', () => {
    it('gets user from hook', async () => {
      const userProxy = new UserProxy({ casl: defaultCaslCache }, () => undefined);
      userProxy.getFromHook = async () => expectedUser;
      expect(await userProxy.get()).toEqual(expectedUser);
    });

    it('gets user from request if no user returned from hook', async () => {
      const userProxy = new UserProxy({ casl: defaultCaslCache }, () => undefined);
      userProxy.getFromHook = async () => undefined;
      userProxy.getFromRequest = () => expectedUser;
      expect(await userProxy.get()).toEqual(expectedUser);
    });

    it('returns undefined if no user returned from hook and request', async () => {
      const userProxy = new UserProxy({ casl: defaultCaslCache }, () => undefined);
      userProxy.getFromHook = async () => undefined;
      userProxy.getFromRequest = () => undefined;
      expect(await userProxy.get()).toEqual(undefined);
    });
  });

  describe('getFromRequest()', () => {
    it('gets user from getUserFromRequest function', async () => {
      const userProxy = new UserProxy({ casl: defaultCaslCache }, () => expectedUser);
      expect(userProxy.getFromRequest()).toEqual(expectedUser);
    });
  });

  describe('getFromHook()', () => {
    it('gets cached user', async () => {
      const userProxy = new UserProxy({ casl: { ...defaultCaslCache, user: expectedUser } }, () => undefined);
      expect(await userProxy.get()).toEqual(expectedUser);
    });

    it('if no user on request return undefined', async () => {
      const userProxy = new UserProxy({ casl: defaultCaslCache }, () => undefined);
      expect(await userProxy.get()).toEqual(undefined);
    });

    it('gets user from hook', async () => {
      const requestUser = { id: 'requestUserId', roles: [] };
      defaultCaslCache.hooks.user = new UserHook();
      const userProxy = new UserProxy({ casl: defaultCaslCache }, () => requestUser);
      expect(await userProxy.getFromHook()).toEqual(expectedUser);
    });
  });
});
