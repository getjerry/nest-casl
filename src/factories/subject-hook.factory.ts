import { ModuleRef } from '@nestjs/core';

import { SubjectBeforeFilterHook, SubjectBeforeFilterTuple } from '../interfaces/hooks.interface';

export class NullSubjectHook implements SubjectBeforeFilterHook {
  public async run(request: any) {
    return undefined;
  }
}

// TODO request generic params
export class TupleSubjectHook<Service = any> implements SubjectBeforeFilterHook {
  constructor(private service: Service, private runFunc: any){}

  public async run(request: any) {
    return this.runFunc(this.service, request);
  }
}

export async function subjectHookFactory(moduleRef: ModuleRef, hookOrTuple?: SubjectBeforeFilterHook | SubjectBeforeFilterTuple) {
  if (!hookOrTuple) {
    return new NullSubjectHook();
  }
  if (Array.isArray(hookOrTuple)) {
    const [ServiceClass, runFunction] = hookOrTuple;
    const service = moduleRef.get(ServiceClass);
    return new TupleSubjectHook<typeof ServiceClass>(service, runFunction);
  }
  return moduleRef.create<SubjectBeforeFilterHook>(hookOrTuple as any);
}
