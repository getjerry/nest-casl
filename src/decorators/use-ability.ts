import { AnyClass, AnyObject } from '@casl/ability/dist/types/types';
import { applyDecorators, UseGuards } from '@nestjs/common';

import { SubjectBeforeFilterHook, SubjectBeforeFilterTuple } from '../interfaces/hooks.interface';
import { AuthorizableRequest } from '../interfaces/request.interface';
import { AccessGuard } from '../access.guard';
import { SetAbility } from './set-ability';

export function UseAbility<Subject = AnyObject, Request = AuthorizableRequest>(
  action: string,
  subject: AnyClass<Subject>,
  subjectHook?: AnyClass<SubjectBeforeFilterHook<Subject, Request>> | SubjectBeforeFilterTuple<Subject, Request>,
): ReturnType<typeof applyDecorators> {
  return applyDecorators(SetAbility(action, subject, subjectHook), UseGuards(AccessGuard));
}
