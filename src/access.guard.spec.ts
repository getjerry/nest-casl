import { Test } from '@nestjs/testing';
import { Reflector } from '@nestjs/core';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';

import { AccessGuard } from './access.guard';
import { AccessService } from './access.service';
import { CaslConfig } from './casl.config';

describe('AccessGuard', () => {
  const req = new Object();
  let abilityMetadata: unknown = {};
  let accessGuard: AccessGuard;
  let accessService: AccessService;

  beforeEach(async () => {
    CaslConfig.getRootOptions = jest.fn().mockImplementation(() => ({}));

    const moduleRef = await Test.createTestingModule({
      providers: [
        AccessGuard,
        { provide: Reflector, useValue: { get: jest.fn().mockImplementation(() => abilityMetadata) } },
        { provide: AccessService, useValue: { canActivateAbility: jest.fn() } },
      ],
    }).compile();

    accessService = moduleRef.get<AccessService>(AccessService);
    accessGuard = moduleRef.get<AccessGuard>(AccessGuard);
  });

  it('passes context request and ability to AccessService.canActivateAbility method', async () => {
    const context = new ExecutionContextHost([req, undefined, { req }]);
    await accessGuard.canActivate(context);
    expect(accessService.canActivateAbility).toBeCalledWith(req, abilityMetadata);
  });

  it('passes context request and ability to AccessService.canActivateAbility method', async () => {
    abilityMetadata = undefined;
    const context = new ExecutionContextHost([req, undefined, { req }]);
    await accessGuard.canActivate(context);
    expect(accessService.canActivateAbility).toBeCalledWith(req, abilityMetadata);
  });
});
