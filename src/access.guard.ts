import { CanActivate, Injectable, ExecutionContext } from '@nestjs/common';
import { ModuleRef, Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';

import { AccessService } from './access.service';
import { CASL_META_ABILITY } from './casl.constants';
import { AbilityMetadata } from './decorators/use-ability';
import { hookFactory } from './hook.factory';
import { ContextWithIdentity } from './interfaces/options.interface';

@Injectable()
export class AccessGuard implements CanActivate {
  constructor(private reflector: Reflector, private readonly accessService: AccessService, private moduleRef: ModuleRef) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ability = this.reflector.get<AbilityMetadata | undefined>(CASL_META_ABILITY, context.getHandler());
    // TODO rest
    const request = GqlExecutionContext.create(context).getContext<ContextWithIdentity>().req;
    const { getUserHook } =  this.accessService.getRootOptions();

    const hooks = {
      subject: await hookFactory(this.moduleRef, ability?.subjectHook),
      user: await hookFactory(this.moduleRef, getUserHook as any), // TODO any
    };

    return await this.accessService.canActivateAbility(request, ability, hooks);
  }
}
