import { Test } from '@nestjs/testing';
import { AbilityFactory } from './ability.factory';

import { DefaultActions as Actions, Permissions } from './interfaces/permissions.interface';
import { Roles } from './__specs__/roles';
import { Post } from './__specs__/post/dtos/post.dto';
import { CASL_FEATURE_OPTIONS } from './casl.constants';

const permissions: Permissions<Roles, Post> = {
  everyone({ can }) {
    can(Actions.read, Post);
  },
  customer({ can }) {
    can(Actions.create, Post);
    can(Actions.delete, Post);
  },
  operator({ can, cannot, extend }) {
    extend(Roles.customer);

    can(Actions.update, Post);
    cannot(Actions.delete, Post);
  },
};

describe('AbilityFactory', () => {
  let abilityFactory: AbilityFactory;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [AbilityFactory, { provide: CASL_FEATURE_OPTIONS, useValue: { permissions } }],
    }).compile();

    abilityFactory = moduleRef.get<AbilityFactory>(AbilityFactory);
  });

  describe('AbilityFactory', () => {
    it("everyone's rules applied to customer", async () => {
      let user = {
        roles: [Roles.customer],
      };
      const ability = abilityFactory.createForUser(user);
      expect(ability.can(Actions.read, Post)).toBe(true);
    });

    it('operator inherits rules from user', async () => {
      let user = {
        roles: [Roles.operator],
      };
      const ability = abilityFactory.createForUser(user);
      expect(ability.can(Actions.read, Post)).toBe(true);
      expect(ability.can(Actions.create, Post)).toBe(true);
      expect(ability.can(Actions.update, Post)).toBe(true);
      expect(ability.can(Actions.delete, Post)).toBe(false);
    });
  });
});
