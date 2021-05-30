// TODO copy type to not depend on external lib internals
import { AnyClass } from '@casl/ability/dist/types/types';
import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { CASL_META_ABILITY } from '../casl.constants';
import { BeforeFilterHook, BeforeFilterTuple } from '../interfaces/hooks.interface';
import { RequestWithIdentity } from '../interfaces/options.interface';

export interface AbilityMetadata<Subject = any, Provider = any, Request = RequestWithIdentity> {
  action: string,
  subject: AnyClass<Subject>,
  subjectHook?: BeforeFilterHook<Subject, Request> | BeforeFilterTuple<Provider, Subject, Request>
}

export function UseAbility<Subject = any, Provider = any, Request = RequestWithIdentity>(
  action: string,
  subject: AnyClass<Subject>,
  subjectHook?: AnyClass<BeforeFilterHook<Subject, Request>> | BeforeFilterTuple<Provider, Subject, Request>,
): CustomDecorator {
  return SetMetadata(CASL_META_ABILITY, { action, subject, subjectHook });
}
