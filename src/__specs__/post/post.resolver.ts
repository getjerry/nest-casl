import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AccessGuard } from '../../access.guard';
import { ConditionsProxy } from '../../conditions.proxy';
import { CaslConditions } from '../../decorators/casl-conditions';
import { UseAbility } from '../../decorators/use-ability';
import { DefaultActions } from '../../interfaces/permissions.interface';
import { CreatePostInput } from './dtos/create-post-input.dto';
import { Post } from './dtos/post.dto';
import { UpdatePostInput } from './dtos/update-post-input.dto';
import { PostHook } from './post.hook';
import { PostService } from './post.service';

@Resolver(() => Post)
export class PostResolver {
  constructor(private postService: PostService) {}

  @Query(() => Post)
  @UseGuards(AccessGuard)
  @UseAbility(DefaultActions.read, Post)
  async post(@Args('id') id: string) {
    return this.postService.findById(id);
  }

  @Query(() => [Post])
  @UseGuards(AccessGuard)
  @UseAbility(DefaultActions.read, Post)
  async posts() {
    return this.postService.findAll();
  }

  @Mutation(() => Post)
  @UseGuards(AccessGuard)
  @UseAbility(DefaultActions.create, Post)
  async createPost(@Args('input') input: CreatePostInput) {
    return this.postService.create(input);
  }

  @Mutation(() => Post)
  @UseGuards(AccessGuard)
  @UseAbility(DefaultActions.update, Post, PostHook)
  async updatePost(@Args('input') input: UpdatePostInput) {
    return this.postService.update(input);
  }

  @Mutation(() => Post)
  @UseGuards(AccessGuard)
  @UseAbility(DefaultActions.delete, Post)
  async deletePost(@Args('id') id: string) {
    return this.postService.delete(id);
  }

  @Mutation(() => Post)
  @UseGuards(AccessGuard)
  @UseAbility<Post, PostService>(DefaultActions.update, Post, [PostService, (request, service) => service.findById(request.id)])
  async updatePostTupleHook(@Args('input') input: UpdatePostInput) {
    return this.postService.update(input);
  }

  @Mutation(() => Post)
  @UseGuards(AccessGuard)
  @UseAbility(DefaultActions.update, Post)
  async updatePostNoHook(
    @Args('input') input: UpdatePostInput,
    @CaslConditions() conditions: ConditionsProxy,
  ) {
    return this.postService.update({
      ...conditions.toTypeOrm(),
      ...input,
    });
  }
}
