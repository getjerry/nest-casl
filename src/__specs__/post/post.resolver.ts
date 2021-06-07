import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { AccessGuard } from '../../access.guard';
import { ConditionsProxy } from '../../proxies/conditions.proxy';
import { CaslConditions } from '../../decorators/casl-conditions';
import { CaslUser } from '../../decorators/casl-user';
import { UseAbility } from '../../decorators/use-ability';
import { Actions } from '../../interfaces/permissions.interface';
import { UserProxy } from '../../proxies/user.proxy';
import { CreatePostInput } from './dtos/create-post-input.dto';
import { Post } from './dtos/post.dto';
import { UpdatePostInput } from './dtos/update-post-input.dto';
import { PostHook } from './post.hook';
import { PostService } from './post.service';
import { AccessService } from '../../access.service';
import { CaslSubject } from '../../decorators/casl-subject';

@Resolver(() => Post)
export class PostResolver {
  constructor(private postService: PostService, private accessService: AccessService) {}

  @Query(() => Post)
  @UseGuards(AccessGuard)
  @UseAbility(Actions.read, Post)
  async post(@Args('id') id: string) {
    return this.postService.findById(id);
  }

  @Query(() => [Post])
  @UseGuards(AccessGuard)
  @UseAbility(Actions.read, Post)
  async posts() {
    return this.postService.findAll();
  }

  @Mutation(() => Post)
  @UseGuards(AccessGuard)
  @UseAbility(Actions.create, Post)
  async createPost(@Args('input') input: CreatePostInput) {
    return this.postService.create(input);
  }

  @Mutation(() => Post)
  @UseGuards(AccessGuard)
  @UseAbility(Actions.delete, Post)
  async deletePost(@Args('id') id: string) {
    return this.postService.delete(id);
  }

  @Mutation(() => Post)
  @UseGuards(AccessGuard)
  @UseAbility(Actions.update, Post, PostHook)
  async updatePost(@Args('input') input: UpdatePostInput) {
    return this.postService.update(input);
  }

  @Mutation(() => Post)
  @UseGuards(AccessGuard)
  @UseAbility<Post, PostService>(Actions.update, Post, [
    PostService,
      (service, { params }) => service.findById(params.input.id),
  ])
  async updatePostTupleHook(@Args('input') input: UpdatePostInput) {
    return this.postService.update(input);
  }

  @Mutation(() => Post)
  @UseGuards(AccessGuard)
  @UseAbility(Actions.update, Post)
  async updatePostNoHook(@Args('input') input: UpdatePostInput) {
    return this.postService.update(input);
  }

  @Mutation(() => Post)
  @UseGuards(AccessGuard)
  @UseAbility(Actions.update, Post, PostHook)
  async updatePostUserParam(@Args('input') input: UpdatePostInput, @CaslUser() user: UserProxy) {
    this.postService.addUser(await user.get());
    return this.postService.update(input);
  }

  @Mutation(() => Post)
  @UseGuards(AccessGuard)
  async updatePostUserParamNoAbility(@Args('input') input: UpdatePostInput, @CaslUser() user: UserProxy) {
    this.postService.addUser(await user.get());
    return this.postService.update(input);
  }

  @Mutation(() => Post)
  @UseGuards(AccessGuard)
  @UseAbility(Actions.update, Post, PostHook)
  async updatePostSubjectParam(@Args('input') input: UpdatePostInput, @CaslSubject() subject: Post) {
    return this.postService.update(subject);
  }

  @Mutation(() => Post)
  @UseGuards(AccessGuard)
  @UseAbility<Post, PostService>(Actions.update, Post, [
    PostService,
    (service, { params }) => service.findById(params.input.id),
  ])
  async updatePostSubjectParamTuple(@Args('input') input: UpdatePostInput, @CaslSubject() subject: Post) {
    return this.postService.update(subject);
  }

  @Mutation(() => Post)
  @UseGuards(AccessGuard)
  @UseAbility(Actions.update, Post, PostHook)
  async updatePostConditionParam(@Args('input') input: UpdatePostInput, @CaslConditions() conditions: ConditionsProxy) {
    return this.postService.update(input, conditions.toSql());
  }

  @Mutation(() => Post)
  @UseGuards(AccessGuard)
  @UseAbility(Actions.update, Post)
  async updatePostConditionParamNoHook(@Args('input') input: UpdatePostInput, @CaslConditions() conditions: ConditionsProxy) {
    return this.postService.update(input, conditions.toSql());
  }
}
