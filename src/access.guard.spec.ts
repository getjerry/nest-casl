import { Test } from '@nestjs/testing';
import { Reflector } from '@nestjs/core';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';

import { AccessGuard } from './access.guard';
import { AccessService } from './access.service';

describe('AccessGuard', () => {
  const req = new Object();
  const ability = jest.fn();
  let accessGuard: AccessGuard;
  let accessService: AccessService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AccessGuard,
        { provide: Reflector, useValue: { get: jest.fn().mockImplementation(() => ability) } },
        { provide: AccessService, useValue: { canActivateAbility: jest.fn(), getRootOptions: jest.fn().mockImplementation(() => ({})) } },
      ],
    }).compile();

    accessService = moduleRef.get<AccessService>(AccessService);
    accessGuard = moduleRef.get<AccessGuard>(AccessGuard);
  });

  it('passes context request and ability to AccessService.canActivateAbility method', async () => {
    const context = new ExecutionContextHost([undefined, undefined, { req }]);
    await accessGuard.canActivate(context);
    expect(accessService.canActivateAbility).toBeCalledWith(req, ability, { subject: {}, user: {} });
  });
});
