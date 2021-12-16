import { AnyClass, AnyObject } from '@casl/ability/dist/types/types';
import { ModuleRef } from '@nestjs/core';

import { AuthorizableRequest } from '../interfaces/request.interface';
import { SubjectBeforeFilterHook, SubjectBeforeFilterTuple } from '../interfaces/hooks.interface';

export class NullSubjectHook implements SubjectBeforeFilterHook {
  public async run(): Promise<undefined> {
    return undefined;
  }
}

// TODO request generic params
export class TupleSubjectHook<Service> implements SubjectBeforeFilterHook {
  constructor(
    private service: Service,
    private runFunc: (service: Service, request: AuthorizableRequest) => Promise<AnyObject | undefined>,
  ) {
  }

  public async run(request: AuthorizableRequest): Promise<AnyObject | undefined> {
    return this.runFunc(this.service, request);
  }
}

export async function subjectHookFactory(
  moduleRef: ModuleRef,
  hookOrTuple?: AnyClass<SubjectBeforeFilterHook> | SubjectBeforeFilterTuple,
): Promise<SubjectBeforeFilterHook> {
  if (!hookOrTuple) {
    return new NullSubjectHook();
  }
  if (Array.isArray(hookOrTuple)) {
    const [ServiceClass, runFunction] = hookOrTuple;
    const service = moduleRef.get(ServiceClass, { strict: false });
    return new TupleSubjectHook<typeof ServiceClass>(service, runFunction);
  }
  return moduleRef.create<SubjectBeforeFilterHook>(hookOrTuple);
}
