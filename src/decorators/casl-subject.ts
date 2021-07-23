import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { SubjectProxy } from '../proxies/subject.proxy';
import { ContextProxy } from '../proxies/context.proxy';

export const CaslSubject = createParamDecorator((data: unknown, context: ExecutionContext) => {
  return new SubjectProxy(ContextProxy.create(context).getRequest());
});
