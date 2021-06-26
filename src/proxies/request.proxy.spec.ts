import { NullUserHook } from '../factories/user-hook.factory';
import { NullSubjectHook } from '../factories/subject-hook.factory';
import { CaslRequestCache } from '../interfaces/casl-request-cache.interface';
import { RequestProxy } from './request.proxy';
import { ConditionsProxy } from './conditions.proxy';

const defaultCaslCache: CaslRequestCache = {
  hooks: {
    subject: new NullSubjectHook(),
    user: new NullUserHook(),
  },
};

describe('RequestProxy', () => {
  let requestProxy: RequestProxy;

  beforeEach(() => {
    requestProxy = new RequestProxy({ casl: defaultCaslCache });
  });

  it('getConditions returns cached conditions', () => {
    const conditions = new ConditionsProxy([{ userId: 'userId' }]);
    requestProxy.setConditions(conditions);
    expect(requestProxy.getConditions()).toEqual(conditions);
  });

  it('getSubject returns cached subject', () => {
    const subject = { userId: 'userId' };
    requestProxy.setSubject(subject);
    expect(requestProxy.getSubject()).toEqual(subject);
  });
});
