import { Test } from '@nestjs/testing';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';

import { AccessService } from './access.service';
import { AuthorizableUser } from './interfaces/authorizable-user.interface';
import { Permissions } from './interfaces/permissions.interface';
import { Roles } from './__specs__/app/app.roles';
import { Post } from './__specs__/app/post/dtos/post.dto';
import { Actions } from './actions.enum';
import { AbilityFactory } from './factories/ability.factory';
import { CASL_FEATURE_OPTIONS } from './casl.constants';
import { CaslConfig } from './casl.config';

const permissions: Permissions<Roles, Post> = {
  everyone({ can }) {
    can(Actions.read, Post);
  },
  customer({ user, can }) {
    can(Actions.update, Post, { userId: user.id });
  },
  operator({ can }) {
    can(Actions.manage, Post);
  },
};

describe('AccessService', () => {
  let accessService: AccessService;
  let user: AuthorizableUser = { id: 'userId', roles: [Roles.customer] };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AccessService,
        AbilityFactory,
        { provide: CASL_FEATURE_OPTIONS, useValue: { permissions } }
      ],
    }).compile();

    accessService = moduleRef.get(AccessService);
  });

  describe('hasAbility()', () => {
    user = { id: 'userId', roles: [Roles.operator] };

    it('can check ability', async () => {
      expect(accessService.hasAbility(user, Actions.delete, Post)).toBeTruthy();
    });

    it('deny access without user', async () => {
      expect(accessService.hasAbility(undefined as never, Actions.delete, Post)).toBeFalsy();
    });

    it('deny access without action', async () => {
      expect(accessService.hasAbility(user, undefined as never, Post)).toBeFalsy();
    });

    it('deny access without subject', async () => {
      expect(accessService.hasAbility(user, Actions.delete, undefined as never)).toBeFalsy();
    });

    it('allow access to superuser', async () => {
      const getRootOptions = CaslConfig.getRootOptions;
      CaslConfig.getRootOptions = jest.fn().mockImplementation(() => ({ superuserRole: Roles.admin }));
      user = { id: 'userId', roles: [Roles.admin] };
      expect(accessService.hasAbility(user, Actions.delete, Post)).toBeTruthy();
      CaslConfig.getRootOptions = getRootOptions;
    });
  });

  describe('assertAbility()', () => {
    it('throw UnauthorizedException for ability without conditions and class subject', async () => {
      expect(() => accessService.assertAbility(user, Actions.delete, Post)).toThrowError(UnauthorizedException);
    });

    it('throw UnauthorizedException for ability without conditions and instance subject', async () => {
      const post = new Post();
      expect(() => accessService.assertAbility(user, Actions.delete, post)).toThrowError(UnauthorizedException);
    });

    it('throw NotFoundException for ability with conditions and instance subject', async () => {
      user = { id: 'otherUserId', roles: [Roles.customer] };
      const post = new Post();
      expect(() => accessService.assertAbility(user, Actions.update, post)).toThrowError(NotFoundException);
    });

    it('do not throw for ability with conditions and class subject', async () => {
      user = { id: 'otherUserId', roles: [Roles.customer] };
      expect(() => accessService.assertAbility(user, Actions.update, Post)).not.toThrowError();
    });
  });
});

// // const context = ({
// //   getType() {
// //     return 'graphql';
// //   },
// //   getHandler() {
// //     return AccessGuard;
// //   },
// //   getClass() {
// //     return AccessGuard;
// //   },
// //   getContext() {
// //     return { req: {} };
// //   },

// //   // getRoot<T = any>(): T;
// //   getArgs() {
// //     return {};
// //   },
// //   // getContext<T = any>(): T;
// //   // getInfo<T = any>(): T;

// // } as unknown) as ExecutionContext;
