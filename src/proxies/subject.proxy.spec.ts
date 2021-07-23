import { CaslRequestCache } from '../interfaces/casl-request-cache.interface';
import { SubjectBeforeFilterHook } from '../interfaces/hooks.interface';
import { NullSubjectHook } from '../factories/subject-hook.factory';
import { NullUserHook } from '../factories/user-hook.factory';
import { SubjectProxy } from './subject.proxy';

const expectedSubject = { id: 'subjectId' };

class SubjectHook implements SubjectBeforeFilterHook {
  public async run() {
    return expectedSubject;
  }
}

describe('SubjectProxy', () => {
  const defaultCaslCache: CaslRequestCache = {
    hooks: {
      subject: new NullSubjectHook(),
      user: new NullUserHook(),
    },
  };

  describe('get()', () => {
    it('gets cached subject', async () => {
      const subjectProxy = new SubjectProxy({ casl: { ...defaultCaslCache, subject: expectedSubject } });
      expect(await subjectProxy.get()).toEqual(expectedSubject);
    });

    it('if no cached subject return undefined', async () => {
      const subjectProxy = new SubjectProxy({ casl: defaultCaslCache });
      expect(await subjectProxy.get()).toEqual(undefined);
    });

    it('gets subject from hook', async () => {
      defaultCaslCache.hooks.subject = new SubjectHook();
      const subjectProxy = new SubjectProxy({ casl: defaultCaslCache });
      expect(await subjectProxy.get()).toEqual(expectedSubject);
    });
  });
});
