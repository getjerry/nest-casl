import { ModuleRef } from '@nestjs/core';
import { BeforeFilterHook, BeforeFilterTuple } from './interfaces/hooks.interface';

class NullHook implements BeforeFilterHook {
  public async run(request: any) {
    return undefined;
  }
}

// TODO request generic params
class TupleHook<S> implements BeforeFilterHook {
  constructor(private service: S, private runFunc: any){}

  public async run(request: any) {
    return this.runFunc(request, this.service);
  }
}

export async function hookFactory(moduleRef: ModuleRef, hookOrTuple?: BeforeFilterHook | BeforeFilterTuple) {
  if (!hookOrTuple) {
    return new NullHook();
  }
  if (Array.isArray(hookOrTuple)) {
    const [ServiceClass, runFunction] = hookOrTuple;
    const service = moduleRef.get(ServiceClass);
    return new TupleHook<typeof ServiceClass>(service, runFunction);
  }
  return moduleRef.create<BeforeFilterHook>(hookOrTuple as any);
}
