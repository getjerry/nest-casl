import { AnyClass } from '@casl/ability/dist/types/types';
import { RequestWithIdentity } from './options.interface';

export interface BeforeFilterHook<Subject = any, Request = RequestWithIdentity> {
  run: (request: Request) => Promise<Subject|undefined>;
}

export type BeforeFilterTuple<Provider = any, Subject = any, Request = RequestWithIdentity> = [
  AnyClass<Provider>,
  (request: Request, provider: Provider) => Promise<Subject>,
];
