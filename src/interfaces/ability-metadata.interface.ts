import { AnyClass } from '@casl/ability/dist/types/types';
import { SubjectBeforeFilterHook, SubjectBeforeFilterTuple } from '../interfaces/hooks.interface';
import { AuthorizableRequest } from "../interfaces/request.interface";

export interface AbilityMetadata<Subject = any, Request = AuthorizableRequest> {
  action: string,
  subject: AnyClass<Subject>,
  subjectHook?: SubjectBeforeFilterHook<Subject, Request> | SubjectBeforeFilterTuple<Subject, Request>
}
