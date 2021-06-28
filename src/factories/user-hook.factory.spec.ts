import { ModuleRef } from '@nestjs/core';
import { TupleUserHook, userHookFactory } from './user-hook.factory';

class ServiceClass {}

describe('userHookFactory', () => {
  const moduleRef = {
    get: jest.fn(),
  } as unknown as ModuleRef;

  it('resolves to instance of TupleUserHook with tuple hook passed', async () => {
    expect(await userHookFactory(moduleRef, [ServiceClass, async (user) => user])).toBeInstanceOf(TupleUserHook);
  });

  it('TupleUserHook runs passed function', async () => {
    const tupleFunc = jest.fn().mockImplementation(async (user) => user);
    const tupleUserHook = await userHookFactory(moduleRef, [ServiceClass, tupleFunc]);
    tupleUserHook.run({ id: 'id', roles: [] });
    expect(tupleFunc).toBeCalled();
  });
});
