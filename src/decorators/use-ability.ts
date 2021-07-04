import { AnyClass, AnyObject } from '@casl/ability/dist/types/types';
import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { CASL_META_ABILITY } from '../casl.constants';
import { SubjectBeforeFilterHook, SubjectBeforeFilterTuple } from '../interfaces/hooks.interface';
import { AuthorizableRequest } from '../interfaces/request.interface';

export function UseAbility<Subject = AnyObject, Request = AuthorizableRequest>(
  action: string,
  subject: AnyClass<Subject>,
  subjectHook?: AnyClass<SubjectBeforeFilterHook<Subject, Request>> | SubjectBeforeFilterTuple<Subject, Request>,
): CustomDecorator {
  return SetMetadata(CASL_META_ABILITY, { action, subject, subjectHook });
}
