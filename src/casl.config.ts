import { CASL_ROOT_OPTIONS } from './casl.constants';
import { OptionsForRoot } from './interfaces/options.interface';

type DefaultedOptionsForRoot = OptionsForRoot & Required<Pick<OptionsForRoot, 'getUserFromRequest'>>;

export class CaslConfig {
  static getRootOptions(): DefaultedOptionsForRoot {
    const rootOptions = (Reflect.getMetadata(CASL_ROOT_OPTIONS, CaslConfig) || {}) as DefaultedOptionsForRoot;
    if (!rootOptions.getUserFromRequest) {
      return {
        ...rootOptions,
        getUserFromRequest: (request) => request.user,
      };
    }
    return rootOptions;
  }
}
