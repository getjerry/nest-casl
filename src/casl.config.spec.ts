import { OptionsForRoot } from './interfaces/options.interface';
import { CASL_ROOT_OPTIONS } from './casl.constants';
import { CaslConfig } from './casl.config';
import { NullUserHook } from './factories/user-hook.factory';
import { NullSubjectHook } from './factories/subject-hook.factory';

describe('CaslConfig', () => {
  const user = { id: '', roles: [] };
  let rootOptions: OptionsForRoot = { getUserFromRequest: () => user };

  beforeEach(async () => {
    Reflect.getMetadata = jest.fn().mockImplementation(() => rootOptions);
  });

  it('should get root options from CaslConfig metadata', async () => {
    expect(CaslConfig.getRootOptions()).toEqual(rootOptions);
    expect(Reflect.getMetadata).toBeCalledWith(CASL_ROOT_OPTIONS, CaslConfig);
  });

  it('should work with undefined metadata', async () => {
    Reflect.getMetadata = jest.fn().mockImplementation(() => undefined);
    expect(CaslConfig.getRootOptions()).toBeTruthy();
  });

  it('should add default getUserFromRequest function if not set', async () => {
    rootOptions = {};
    expect(
      CaslConfig.getRootOptions().getUserFromRequest({
        user,
        casl: { hooks: { user: new NullUserHook(), subject: new NullSubjectHook() } },
      }),
    ).toEqual(user);
  });
});
