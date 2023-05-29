import { Test } from '@nestjs/testing';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';

import { AccessService } from './access.service';
import { Permissions } from './interfaces/permissions.interface';
import { Roles } from './__specs__/app/app.roles';
import { Post } from './__specs__/app/post/dtos/post.dto';
import { Actions } from './actions.enum';
import { AbilityFactory } from './factories/ability.factory';
import { CASL_FEATURE_OPTIONS } from './casl.constants';
import { CaslConfig } from './casl.config';
import { NullSubjectHook } from './factories/subject-hook.factory';
import { NullUserHook } from './factories/user-hook.factory';
import { CaslRequestCache } from './interfaces/casl-request-cache.interface';
import { SubjectBeforeFilterHook, UserBeforeFilterHook } from 'interfaces/hooks.interface';
import { AbilityMetadata } from 'interfaces/ability-metadata.interface';
import { User } from '__specs__/app/user/dtos/user.dto';
import { AuthorizableRequest } from './interfaces/request.interface';

const permissions: Permissions<Roles, Post> = {
  everyone({ can }) {
    can(Actions.read, Post);
  },
  customer({ user, can, cannot }) {
    can(Actions.update, Post, { userId: user.id });
    cannot(Actions.update, Post, ['userId']);
  },
  operator({ can }) {
    can(Actions.manage, Post);
  },
};

describe('AccessService', () => {
  let accessService: AccessService;
  let user: User;

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  beforeEach(async () => {
    jest
      .spyOn(CaslConfig, 'getRootOptions')
      .mockImplementation(() => ({ superuserRole: Roles.admin, getUserFromRequest: () => undefined }));
    const moduleRef = await Test.createTestingModule({
      providers: [AccessService, AbilityFactory, { provide: CASL_FEATURE_OPTIONS, useValue: { permissions } }],
    }).compile();

    accessService = moduleRef.get(AccessService);
  });

  describe('getAbility()', () => {
    beforeEach(async () => {
      user = { id: 'userId', roles: [Roles.operator] };
    });

    it('returns user abilities', async () => {
      expect(accessService.getAbility(user).rules).toEqual([
        { action: 'read', subject: Post },
        { action: 'manage', subject: Post },
      ]);
    });
  });

  describe('hasAbility()', () => {
    beforeEach(async () => {
      user = { id: 'userId', roles: [Roles.operator] };
    });

    it('allows access to delete action for operator', async () => {
      expect(accessService.hasAbility(user, Actions.delete, Post)).toBeTruthy();
    });

    it('denies access to delete action for customer', async () => {
      user = { id: 'userId', roles: [Roles.customer] };
      expect(accessService.hasAbility(user, Actions.delete, Post)).toBeFalsy();
    });

    it('allows access to update not restricted field for customer', async () => {
      user = { id: 'userId', roles: [Roles.customer] };
      expect(accessService.hasAbility(user, Actions.update, Post, 'title')).toBeTruthy();
    });

    it('denies access to update restricted field for customer', async () => {
      user = { id: 'userId', roles: [Roles.customer] };
      expect(accessService.hasAbility(user, Actions.update, Post, 'userId')).toBeFalsy();
    });

    it('can check ability', async () => {
      expect(accessService.hasAbility(user, Actions.delete, Post)).toBeTruthy();
      expect(accessService.hasAbility(user, Actions.update, Post, 'userId')).toBeTruthy();
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
      user = { id: 'userId', roles: [Roles.admin] };
      expect(accessService.hasAbility(user, Actions.delete, Post)).toBeTruthy();
    });
  });

  describe('assertAbility()', () => {
    beforeEach(async () => {
      user = { id: 'userId', roles: [Roles.customer] };
    });

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
      expect(() => accessService.assertAbility(user, Actions.update, Post))
    });

    it('throw NotFoundException for ability with restricted field', async () => {
      expect(() => accessService.assertAbility(user, Actions.update, Post, 'userId')).toThrowError(NotFoundException);
    });

    it('do not throw for ability with not restricted field', async () => {
      expect(() => accessService.assertAbility(user, Actions.update, Post, 'title')).not.toThrowError();
    });
  });

  describe('canActivateAbility()', () => {
    const defaultCaslCache: CaslRequestCache = {
      hooks: {
        subject: new NullSubjectHook(),
        user: new NullUserHook(),
      },
    };

    beforeEach(() => {
      jest
        .spyOn(CaslConfig, 'getRootOptions')
        .mockImplementation(() => ({ superuserRole: Roles.admin, getUserFromRequest: () => user }));
    });

    it('deny access without user', async () => {
      const request = { casl: defaultCaslCache };
      const abilityMetadata: AbilityMetadata<Post> = {
        action: Actions.delete,
        subject: Post,
      };
      expect(await accessService.canActivateAbility(request, abilityMetadata)).toBeFalsy();
    });

    it('deny access without ability', async () => {
      const request = { casl: defaultCaslCache };
      expect(await accessService.canActivateAbility(request, undefined)).toBeFalsy();
    });

    it('allow access without subject hook returning undefined', async () => {
      user = { id: 'otherUserId', roles: [Roles.customer] };
      const request = { user, casl: defaultCaslCache };
      const abilityMetadata = {
        action: Actions.update,
        subject: Post,
        subjectHook: NullSubjectHook,
      };
      expect(await accessService.canActivateAbility(request, abilityMetadata)).toBeTruthy();
    });

    it('allow access with subject hook returning object', async () => {
      user = { id: 'userId', roles: [Roles.customer] };

      class UserHook implements UserBeforeFilterHook<User> {
        public async run() {
          return user;
        }
      }

      class PostHook implements SubjectBeforeFilterHook<Post> {
        public async run() {
          return { ...new Post() };
        }
      }

      const request: AuthorizableRequest = {
        user,
        casl: {
          user,
          hooks: {
            subject: new PostHook(),
            user: new UserHook(),
          },
        },
      };

      const abilityMetadata = {
        action: Actions.update,
        subject: Post,
        subjectHook: PostHook,
      };

      expect(await accessService.canActivateAbility(request, abilityMetadata)).toBeFalsy();
    });
  });
});
