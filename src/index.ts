export { CaslModule } from './casl.module';

export { AuthorizableUser } from './interfaces/authorizable-user.interface';

export { AuthorizableRequest } from './interfaces/request.interface';

export { CaslConditions, CaslQueryAuthorize, CaslSubject, CaslUser, UseAbility } from './decorators';

export {
  SubjectBeforeFilterHook,
  SubjectBeforeFilterTuple,
  UserBeforeFilterHook,
  UserBeforeFilterTuple,
} from './interfaces/hooks.interface';

export {
  Actions,
  DefaultActions,
  AnyPermissions,
  DefinePermissions,
  Permissions,
} from './interfaces/permissions.interface';

export { ConditionsProxy } from './proxies/conditions.proxy';

export { UserProxy } from './proxies/user.proxy';

export { AccessGuard } from './access.guard';

export { AccessService } from './access.service';

export { InferSubjects } from '@casl/ability';
