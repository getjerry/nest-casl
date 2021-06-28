import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { ExecutionContext, NotAcceptableException } from '@nestjs/common';
import { AuthorizableRequest } from 'interfaces/request.interface';

export class ContextProxy {
  constructor(private readonly context: ExecutionContext) {}

  public static create(context: ExecutionContext): ContextProxy {
    return new ContextProxy(context);
  }

  public getRequest(): AuthorizableRequest {
    if (this.context.getType() === 'http') {
      return this.context.getArgByIndex(0);
    }

    if (this.context.getType<GqlContextType>() === 'graphql') {
      const ctx = GqlExecutionContext.create(this.context);
      const request = ctx.getContext().req;
      request.params = {
        ...ctx.getArgs(),
        ...request.params,
      };
      return request;
    }

    throw new NotAcceptableException();
  }
}
