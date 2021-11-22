import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { ContextProxy } from '../proxies/context.proxy';
import { CaslConfig } from '../casl.config';
import { UserProxy } from '../proxies/user.proxy';

export const CaslUser = createParamDecorator(async (data: unknown, context: ExecutionContext) => {
  return new UserProxy(await ContextProxy.create(context).getRequest(), CaslConfig.getRootOptions().getUserFromRequest);
});
