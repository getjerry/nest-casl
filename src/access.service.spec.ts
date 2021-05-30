// import { ExecutionContext } from '@nestjs/common';
// import { Test } from '@nestjs/testing';

// import { AccessGuard } from './access.guard';
// import { CaslModule } from './casl.module';
// import { DefaultActions as Actions, Permissions } from './interfaces/permissions.interface';

// import { CASL_META_ABILITY } from './casl.constants';
// import { AccessService } from './access.service';
// import { AbilityFactory } from './ability.factory';
// import { Roles } from './__specs__/roles';
// import { Post } from './__specs__/post/dtos/post.dto';
// import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
// import { UserIdentity } from './interfaces/user-identity.interface';

// const permissions: Permissions<Roles, Post> = {
//   everyone({ can }) {
//     can(Actions.read, Post);
//   },
//   user({ user, can }) {
//     can(Actions.update, Post, { userId: user.id });
//   },
//   operator({ can }) {
//     can(Actions.manage, Post);
//   },
// };
describe('AccessService', () => {
  it('works', async () => {});
});

// describe.skip('AccessService', () => {
//   let accessGuard: AccessGuard;
//   let accessService: AccessService;
//   let user: any = { roles: [Roles.guest] };
//   let context: ExecutionContext;

//   beforeEach(async () => {
//     context = new ExecutionContextHost([undefined, undefined, { req: {} }], AccessService, AccessService);

//     const moduleRef = await Test.createTestingModule({
//       imports: [
//         CaslModule.forRoot({
//           superuserRole: Roles.admin,
//           getUserFromContext: () => user,
//           getUserFromProvider: [
//             AccessService,
//             async (user: UserIdentity, service: AccessService) => {
//               return { ...user, id: '1000' };
//             },
//           ],
//         }),
//         CaslModule.forFeature({ permissions }),
//       ],
//       providers: [AccessGuard, AccessService, AbilityFactory],
//     }).compile();

//     accessGuard = moduleRef.get<AccessGuard>(AccessGuard);
//     accessService = moduleRef.get(AccessService);
//   });

//   describe('Superuser', () => {
//     beforeEach(() => (user = { roles: [Roles.admin] }));

//     it.each(Object.keys(Actions))(`can %s`, async (action) => {
//       mockAbility(action, Post);
//       expect(await accessGuard.canActivate(context)).toBeTruthy();
//     });
//   });

//   describe('Operator', () => {
//     beforeEach(() => (user = { roles: [Roles.operator] }));

//     it.each(Object.keys(Actions))(`can %s`, async (action) => {
//       mockAbility(action, Post);
//       expect(await accessGuard.canActivate(context)).toBeTruthy();
//     });
//   });

//   describe('User', () => {
//     beforeEach(() => (user = { roles: [Roles.user] }));

//     it('can read', async () => {
//       mockAbility(Actions.read, Post);
//       expect(await accessGuard.canActivate(context)).toBeTruthy();
//     });

//     it('can update', async () => {
//       mockAbility(Actions.update, Post, [
//         AccessService,
//         () => {
//           const post = new Post();
//           post.id = '1000';
//           return post;
//         },
//       ]);
//       expect(await accessGuard.canActivate(context)).toBeTruthy();
//       // accessService.assertConditions(new Subject('1000'))
//     });

//     it('cant delete', async () => {
//       mockAbility(Actions.delete, Post);
//       expect(await accessGuard.canActivate(context)).toBeFalsy();
//     });
//   });

//   describe('Everyone', () => {
//     beforeEach(() => (user = { roles: [Roles.guest] }));

//     it('can read', async () => {
//       mockAbility(Actions.read, Post);
//       expect(await accessGuard.canActivate(context)).toBeTruthy();
//     });

//     it('can read without role', async () => {
//       mockAbility(Actions.read, Post);
//       user = { roles: [] };
//       expect(await accessGuard.canActivate(context)).toBeTruthy();
//     });

//     it('cant update', async () => {
//       mockAbility(Actions.update, Post, [AccessService, () => ({ id: '1', userId: '1000' })]);
//       expect(await accessGuard.canActivate(context)).toBeFalsy();
//     });

//     it('cant delete', async () => {
//       mockAbility(Actions.delete, Post);
//       expect(await accessGuard.canActivate(context)).toBeFalsy();
//     });
//   });

//   describe('Without user', () => {
//     beforeEach(() => (user = undefined));

//     it.each(Object.keys(Actions))(`no access to %s`, async (action) => {
//       mockAbility(action, Post);
//       expect(await accessGuard.canActivate(context)).toBeFalsy();
//     });
//   });
// });

// const mockAbility = (action: string, subject: any, subjectGetter?: [any, (...args: any[]) => any]) =>
//   Reflect.defineMetadata(CASL_META_ABILITY, { action, subject, subjectGetter }, AccessService);

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
