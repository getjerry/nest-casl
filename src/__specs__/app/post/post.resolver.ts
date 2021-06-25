import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  AccessService,
  Actions,
  ConditionsProxy,
  CaslConditions,
  CaslSubject,
  CaslUser,
  UseAbility,
  UserProxy,
} from 'nest-casl';

import { Post } from './dtos/post.dto';
import { PostHook } from './post.hook';
import { PostService } from './post.service';
import { CreatePostInput } from './dtos/create-post-input.dto';
import { UpdatePostInput } from './dtos/update-post-input.dto';
import { User } from '../user/dtos/user.dto';

@Resolver(() => Post)
export class PostResolver {
  constructor(private postService: PostService, private accessService: AccessService) {}

  @Query(() => Post)
  @UseAbility(Actions.read, Post)
  async post(@Args('id') id: string) {
    return this.postService.findById(id);
  }

  @Query(() => [Post])
  @UseAbility(Actions.read, Post)
  async posts() {
    return this.postService.findAll();
  }

  @Mutation(() => Post)
  @UseAbility(Actions.create, Post)
  async createPost(@Args('input') input: CreatePostInput) {
    return this.postService.create(input);
  }

  @Mutation(() => Post)
  @UseAbility(Actions.delete, Post)
  async deletePost(@Args('id') id: string) {
    return this.postService.delete(id);
  }

  @Mutation(() => Post)
  @UseAbility(Actions.update, Post, PostHook)
  async updatePost(@Args('input') input: UpdatePostInput) {
    return this.postService.update(input);
  }

  @Mutation(() => Post)
  @UseAbility<Post>(Actions.update, Post, [
    PostService,
    (service: PostService, { params }) => service.findById(params.input.id),
  ])
  async updatePostTupleHook(@Args('input') input: UpdatePostInput) {
    return this.postService.update(input);
  }

  @Mutation(() => Post)
  @UseAbility(Actions.update, Post)
  async updatePostNoHook(@Args('input') input: UpdatePostInput) {
    return this.postService.update(input);
  }

  @Mutation(() => Post)
  @UseAbility(Actions.update, Post, PostHook)
  async updatePostUserParam(@Args('input') input: UpdatePostInput, @CaslUser() user: UserProxy<User>) {
    this.postService.addUser(await user.get());
    return this.postService.update(input);
  }

  @Mutation(() => Post)
  async updatePostUserParamNoAbility(@Args('input') input: UpdatePostInput, @CaslUser() user: UserProxy<User>) {
    this.postService.addUser(await user.get());
    return this.postService.update(input);
  }

  @Mutation(() => Post)
  @UseAbility(Actions.update, Post, PostHook)
  async updatePostSubjectParam(@Args('input') input: UpdatePostInput, @CaslSubject() subject: Post) {
    return this.postService.update(subject);
  }

  @Mutation(() => Post)
  @UseAbility<Post>(Actions.update, Post, [
    PostService,
    (service: PostService, { params }) => service.findById(params.input.id),
  ])
  async updatePostSubjectParamTuple(@Args('input') input: UpdatePostInput, @CaslSubject() subject: Post) {
    return this.postService.update(subject);
  }

  @Mutation(() => Post)
  @UseAbility(Actions.update, Post, PostHook)
  async updatePostConditionParam(@Args('input') input: UpdatePostInput, @CaslConditions() conditions: ConditionsProxy) {
    return this.postService.update(input, conditions.toSql());
  }

  @Mutation(() => Post)
  @UseAbility(Actions.update, Post)
  async updatePostConditionParamNoHook(
    @Args('input') input: UpdatePostInput,
    @CaslConditions() conditions: ConditionsProxy,
  ) {
    return this.postService.update(input, conditions.toSql());
  }
}
