import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const CaslConditions = createParamDecorator((data: unknown, context: ExecutionContext) => {
  // TODO rest
  const ctx = GqlExecutionContext.create(context);
  return ctx.getContext().req.casl.conditions;
});
