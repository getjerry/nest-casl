import { DynamicModule, Module } from '@nestjs/common';

import { OptionsForFeature, OptionsForRoot } from './interfaces/options.interface';
import { CASL_ROOT_OPTIONS, CASL_FEATURE_OPTIONS } from './casl.constants';
import { AccessService } from './access.service';
import { AbilityFactory } from './ability.factory';
import { UserIdentity } from './interfaces/user-identity.interface';

@Module({
  imports: [],
  providers: [
    AccessService,
    AbilityFactory,
    {
      provide: CASL_FEATURE_OPTIONS,
      useValue: {},
    },
  ],
  exports: [AccessService, AbilityFactory, CASL_FEATURE_OPTIONS],
})
export class CaslModule {
  static forFeature(options: OptionsForFeature): DynamicModule {
    return {
      module: CaslModule,
      imports: [],
      exports: [AccessService, AbilityFactory],
      providers: [
        AccessService,
        AbilityFactory,
        {
          provide: CASL_FEATURE_OPTIONS,
          useValue: options,
        },
      ],
    };
  }

  static forRoot<U = UserIdentity>(options: OptionsForRoot<U>): DynamicModule {
    Reflect.defineMetadata(CASL_ROOT_OPTIONS, options, AccessService);
    return {
      module: CaslModule,
    };
  }
}
