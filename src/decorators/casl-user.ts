import { createParamDecorator, ExecutionContext } from '@nestjs/common';
// import { ModuleRef } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';

export const CaslUser = createParamDecorator(async (data: unknown, context: ExecutionContext) => {
  // TODO rest
  const ctx = GqlExecutionContext.create(context);
  // force hook run if no caslUser
  return ctx.getContext().req.caslUser;
});
