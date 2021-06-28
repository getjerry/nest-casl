import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { ContextProxy } from '../proxies/context.proxy';

export const CaslSubject = createParamDecorator((data: unknown, context: ExecutionContext) => {
  const request = ContextProxy.create(context).getRequest();
  return request.casl.subject;
});
