// TODO copy type to not depend on external lib internals
import { AnyClass } from '@casl/ability/dist/types/types';
import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { CASL_META_ABILITY } from '../casl.constants';
import { SubjectBeforeFilterHook, SubjectBeforeFilterTuple } from '../interfaces/hooks.interface';
import { AuthorizableRequest } from "../interfaces/request.interface";

export interface AbilityMetadata<Subject = any, Service = any, Request = AuthorizableRequest> {
  action: string,
  subject: AnyClass<Subject>,
  subjectHook?: SubjectBeforeFilterHook<Subject, Request> | SubjectBeforeFilterTuple<Subject, Request>
}

export function UseAbility<Subject = any, Request = AuthorizableRequest>(
  action: string,
  subject: AnyClass<Subject>,
  subjectHook?: AnyClass<SubjectBeforeFilterHook<Subject, Request>> | SubjectBeforeFilterTuple<Subject, Request>,
): CustomDecorator {
  return SetMetadata(CASL_META_ABILITY, { action, subject, subjectHook });
}
