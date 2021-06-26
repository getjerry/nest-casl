export { CaslModule } from './casl.module';

export { AuthorizableUser } from './interfaces/authorizable-user.interface';

export { AuthorizableRequest } from './interfaces/request.interface';
export { AuthorizableRequest as Request } from './interfaces/request.interface';

export { CaslConditions, CaslSubject, CaslUser, SetAbility, UseAbility } from './decorators';

export {
  SubjectBeforeFilterHook,
  SubjectBeforeFilterTuple,
  UserBeforeFilterHook,
  UserBeforeFilterTuple,
} from './interfaces/hooks.interface';

export { AnyPermissions, DefinePermissions, Permissions } from './interfaces/permissions.interface';

export { Actions, DefaultActions } from './actions.enum';

export { ConditionsProxy } from './proxies/conditions.proxy';

export { UserProxy } from './proxies/user.proxy';

export { AccessGuard } from './access.guard';

export { AccessService } from './access.service';

export { InferSubjects } from '@casl/ability';
