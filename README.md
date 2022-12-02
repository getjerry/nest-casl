# Access control for Nestjs with CASL

[![CI Build](https://github.com/getjerry/nest-casl/actions/workflows/build.yml/badge.svg)](https://github.com/getjerry/nest-casl/actions/workflows/build.yml)
[![Dependabot status](https://badgen.net/badge/dependabot/enabled/green?icon=dependabot)](https://github.com/dependabot)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/getjerry/nest-casl)
[![NPM version](https://img.shields.io/npm/v/nest-casl.svg)](https://www.npmjs.com/package/nest-casl)

[Nest.js](https://docs.nestjs.com/)

[CASL](https://casl.js.org/v5/en/guide/intro)

## Installation

Install npm package with `yarn add nest-casl` or `npm i nest-casl`

Peer dependencies are `@nestjs/core`, `@nestjs/common` and `@nestjs/graphql`

## Application configuration

Define roles for app:

```typescript
// app.roles.ts

export enum Roles {
  admin = 'admin',
  operator = 'operator',
  customer = 'customer',
}
```

Configure application:

```typescript
// app.module.ts

import { Module } from '@nestjs/common';
import { CaslModule } from 'nest-casl';
import { Roles } from './app.roles';

@Module({
  imports: [
    CaslModule.forRoot<Roles>({
      // Role to grant full access, optional
      superuserRole: Roles.admin,
      // Function to get casl user from request
      // Optional, defaults to `(request) => request.user`
      getUserFromRequest: (request) => request.currentUser,
    }),
  ],
})
export class AppModule {}
```

`superuserRole` will have unrestricted access. If `getUserFromRequest` omitted `request.user` will be used. User expected to have properties `id: string` and `roles: Roles[]` by default, request and user types [can be customized](#custom-user-and-request-types).

## Permissions definition

`nest-casl` comes with a set of default actions, aligned with [Nestjs Query](https://doug-martin.github.io/nestjs-query/docs/graphql/authorization).
`manage` has a special meaning of any action.
DefaultActions aliased to `Actions` for convenicence.

```typescript
export enum DefaultActions {
  read = 'read',
  aggregate = 'aggregate',
  create = 'create',
  update = 'update',
  delete = 'delete',
  manage = 'manage',
}
```

In case you need custom actions either [extend DefaultActions](#custom-actions) or just copy and update, if extending typescript enum looks too tricky.

Permissions defined per module. `everyone` permissions applied to every user, it has `every` alias for `every({ user, can })` be more readable. Roles can be extended with previously defined roles.

```typescript
// post.permissions.ts

import { Permissions, Actions } from 'nest-casl';
import { InferSubjects } from '@casl/ability';

import { Roles } from '../app.roles';
import { Post } from './dtos/post.dto';
import { Comment } from './dtos/comment.dto';

export type Subjects = InferSubjects<typeof Post, typeof Comment>;

export const permissions: Permissions<Roles, Subjects, Actions> = {
  everyone({ can }) {
    can(Actions.read, Post);
    can(Actions.create, Post);
  },

  customer({ user, can }) {
    can(Actions.update, Post, { userId: user.id });
  },

  operator({ can, cannot, extend }) {
    extend(Roles.customer);

    can(Actions.manage, PostCategory);
    can(Actions.manage, Post);
    cannot(Actions.delete, Post);
  },
};
```

```typescript
// post.module.ts

import { Module } from '@nestjs/common';
import { CaslModule } from 'nest-cast';

import { permissions } from './post.permissions';

@Module({
  imports: [CaslModule.forFeature({ permissions })],
})
export class PostModule {}
```

## Access control

Assuming authentication handled by AuthGuard. AccessGuard expects user to at least exist, if not authenticated user obtained from request acess will be denied.

```typescript
// post.resolver.ts

import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AccessGuard, UseAbility, Actions } from 'nest-casl';

import { CreatePostInput } from './dtos/create-post-input.dto';
import { UpdatePostInput } from './dtos/update-post-input.dto';
import { PostService } from './post.service';
import { PostHook } from './post.hook';
import { Post } from './dtos/post.dto';

@Resolver(() => Post)
export class PostResolver {
  constructor(private postService: PostService) {}

  // No access restrictions, no request.user
  @Query(() => [Post])
  posts() {
    return this.postService.findAll();
  }

  // No access restrictions, request.user populated
  @Query(() => Post)
  @UseGuards(AuthGuard)
  async post(@Args('id') id: string) {
    return this.postService.findById(id);
  }

  // Tags method with ability action and subject and adds AccessGuard implicitly
  @UseGuards(AuthGuard, AccessGuard)
  @UseAbility(Actions.create, Post)
  async createPost(@Args('input') input: CreatePostInput) {
    return this.postService.create(input);
  }

  // Use hook to get subject for conditional rule
  @Mutation(() => Post)
  @UseGuards(AuthGuard, AccessGuard)
  @UseAbility(Actions.update, Post, PostHook)
  async updatePost(@Args('input') input: UpdatePostInput) {
    return this.postService.update(input);
  }
}
```

### Subject hook

For permissions with conditions we need to provide subject hook in UseAbility decorator. It can be class implementing `SubjectBeforeFilterHook` interface

```typescript
// post.hook.ts
import { Injectable } from '@nestjs/common';
import { Request, SubjectBeforeFilterHook } from 'nest-casl';

import { PostService } from './post.service';
import { Post } from './dtos/post.dto';

@Injectable()
export class PostHook implements SubjectBeforeFilterHook<Post, Request> {
  constructor(readonly postService: PostService) {}

  async run({ params }: Request) {
    return this.postService.findById(params.input.id);
  }
}
```

passed as third argument of UserAbility

```typescript
@Mutation(() => Post)
@UseGuards(AuthGuard, AccessGuard)
@UseAbility(Actions.update, Post, PostHook)
async updatePost(@Args('input') input: UpdatePostInput) {
  return this.postService.update(input);
}
```

Class hooks are preferred method, it has full dependency injection support and can be reused. Alternatively inline 'tuple hook' may be used, it can inject single service and may be useful for prototyping or single usage use cases.

```typescript
@Mutation(() => Post)
@UseGuards(AuthGuard, AccessGuard)
@UseAbility<Post>(Actions.update, Post, [
  PostService,
  (service: PostService, { params }) => service.findById(params.input.id),
])
async updatePost(@Args('input') input: UpdatePostInput) {
  return this.postService.update(input);
}
```

### CaslSubject decorator

`CaslSubject` decorator provides access to lazy loaded subject, obtained from [subject hook](#subject-hook) and cached on request object.

```typescript
@Mutation(() => Post)
@UseGuards(AuthGuard, AccessGuard)
@UseAbility(Actions.update, Post, PostHook)
async updatePost(
  @Args('input') input: UpdatePostInput,
  @CaslSubject() subjectProxy: SubjectProxy<Post>
) {
  const post = await subjectProxy.get();
}
```

### CaslConditions decorator

Permission conditions can be used in resolver through CaslConditions decorator, ie to filter selected records. Subject hook is not required.

```typescript
@Mutation(() => Post)
@UseGuards(AuthGuard, AccessGuard)
@UseAbility(Actions.update, Post)
async updatePostConditionParamNoHook(
  @Args('input') input: UpdatePostInput,
  @CaslConditions() conditions: ConditionsProxy
) {
  conditions.toSql(); // ['"userId" = $1', ['userId'], []]
  conditions.toMongo(); // { $or: [{ userId: 'userId' }] }
}
```

### CaslUser decorator

`CaslUser` decorator provides access to lazy loaded user, obtained from request or [user hook](#user-hook) and cached on request object.

```typescript
@Mutation(() => Post)
@UseGuards(AuthGuard, AccessGuard)
@UseAbility(Actions.update, Post)
async updatePostConditionParamNoHook(
  @Args('input') input: UpdatePostInput,
  @CaslUser() userProxy: UserProxy<User>
) {
  const user = await userProxy.get();
}
```

### Access service (global)

Use AccessService to check permissions without AccessGuard and UseAbility decorator

```typescript
// ...
import { AccessService, Actions, CaslUser } from 'nest-casl';

@Resolver(() => Post)
export class PostResolver {
  constructor(private postService: PostService, private accessService: AccessService) {}

  @Mutation(() => Post)
  @UseGuards(AuthGuard)
  async updatePost(@Args('input') input: UpdatePostInput, @CaslUser() userProxy: UserProxy<User>) {
    const user = await userProxy.get();
    const post = await this.postService.findById(input.id);

    //check and throw error
    // 403 when no conditions
    // 404 when conditions set
    this.accessService.assertAbility(user, Actions.update, post);

    // return true or false
    this.accessService.hasAbility(user, Actions.update, post);
  }
}
```

### Testing

Check [package e2e tests](https://github.com/getjerry/nest-casl/tree/master/src/__specs__) for application testing example.

## Advanced usage

### User Hook

Sometimes permission conditions require more info on user than exists on `request.user` User hook called after `getUserFromRequest` only for abilities with conditions. Similar to subject hook, it can be class or tuple.
Despite UserHook is configured on application level, it is executed in context of modules under authorization. To avoid importing user service to each module, consider making user module global.

```typescript
// user.hook.ts

import { Injectable } from '@nestjs/common';

import { UserBeforeFilterHook } from 'nest-casl';
import { UserService } from './user.service';
import { User } from './dtos/user.dto';

@Injectable()
export class UserHook implements UserBeforeFilterHook<User> {
  constructor(readonly userService: UserService) {}

  async run(user: User) {
    return {
      ...user,
      ...(await this.userService.findById(user.id)),
    };
  }
}
```

```typescript
//app.module.ts

import { Module } from '@nestjs/common';
import { CaslModule } from 'nest-casl';

@Module({
  imports: [
    CaslModule.forRoot({
      getUserFromRequest: (request) => request.user,
      getUserHook: UserHook,
    }),
  ],
})
export class AppModule {}
```

or with dynamic module initialization

```typescript
//app.module.ts

import { Module } from '@nestjs/common';
import { CaslModule } from 'nest-casl';

@Module({
  imports: [
    CaslModule.forRootAsync({
      useFactory: async (service: SomeCoolService) => {
        const isOk = await service.doSomething();

        return {
          getUserFromRequest: () => {
            if (isOk) {
              return request.user;
            }
          },
        };
      },
      inject: [SomeCoolService],
    }),
  ],
})
export class AppModule {}
```

or with tuple hook

```typescript
//app.module.ts

import { Module } from '@nestjs/common';
import { CaslModule } from 'nest-casl';

@Module({
  imports: [
    CaslModule.forRoot({
      getUserFromRequest: (request) => request.user,
      getUserHook: [
        UserService,
        async (service: UserService, user) => {
          return service.findById(user.id);
        },
      ],
    }),
  ],
})
export class AppModule {}
```

### Custom actions

Extending enums is a bit tricky in TypeScript
There are multiple solutions described in [this issue](https://github.com/microsoft/TypeScript/issues/17592) but this one is the simplest:

```typescript
enum CustomActions {
  feature = 'feature',
}

export type Actions = DefaultActions | CustomActions;
export const Actions = { ...DefaultActions, ...CustomActions };
```

### Custom User and Request types

For example, if you have User with numeric id and current user assigned to `request.loggedInUser`

```typescript
class User implements AuthorizableUser<Roles, number> {
  id: number;
  roles: Array<Roles>;
}

interface CustomAuthorizableRequest {
  loggedInUser: User;
}

@Module({
  imports: [
    CaslModule.forRoot<Roles, User, CustomAuthorizableRequest>({
      superuserRole: Roles.admin,
      getUserFromRequest(request) {
        return request.loggedInUser;
      },
      getUserHook: [
        UserService,
        async (service: UserService, user) => {
          return service.findById(user.id);
        },
      ],
    }),
    //  ...
  ],
})
export class AppModule {}
```
