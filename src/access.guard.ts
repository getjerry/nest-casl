import { CanActivate, Injectable, ExecutionContext } from '@nestjs/common';
import { ModuleRef, Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';

import { AccessService } from './access.service';
import { CaslConfig } from './casl.config';
import { CASL_META_ABILITY } from './casl.constants';
import { AbilityMetadata } from './interfaces/ability-metadata.interface';
import { subjectHookFactory } from './factories/subject-hook.factory';
import { userHookFactory } from './factories/user-hook.factory';
import { ContextWithAuthorizableRequest } from './interfaces/request.interface';
import { RequestProxy } from './proxies/request.proxy';

@Injectable()
export class AccessGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly accessService: AccessService,
    private moduleRef: ModuleRef,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ability = this.reflector.get<AbilityMetadata | undefined>(CASL_META_ABILITY, context.getHandler());
    // TODO rest
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext<ContextWithAuthorizableRequest>().req;
    request.params = {
      ...(ctx.getArgs() || {}),
      ...(request.params || {}),
    };
    const { getUserHook } = CaslConfig.getRootOptions();

    const req = new RequestProxy(request);
    req.setUserHook(await userHookFactory(this.moduleRef, getUserHook));
    req.setSubjectHook(await subjectHookFactory(this.moduleRef, ability?.subjectHook));

    return await this.accessService.canActivateAbility(request, ability);
  }
}
