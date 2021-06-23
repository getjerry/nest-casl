import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthorizableUser } from 'interfaces/authorizable-user.interface';
import { CaslConfig } from '../casl.config';

import { UserProxy } from '../proxies/user.proxy';

export const CaslUser = createParamDecorator(async (data: unknown, context: ExecutionContext) => {
  // TODO rest
  const ctx = GqlExecutionContext.create(context);

  return new UserProxy(ctx.getContext().req, CaslConfig.getRootOptions().getUserFromRequest);
});
