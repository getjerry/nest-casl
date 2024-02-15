import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { AccessGuard, UseAbility, Actions } from 'nest-casl';
import { Post } from './dtos/post.dto';
import { UpdatePostInput } from './dtos/update-post-input.dto';
import { PostHook } from './post.hook';
import { PostService } from './post.service';

@Controller('posts')
export class PostController {
  constructor(private postService: PostService) {}

  @Get()
  @UseAbility(Actions.read, Post)
  async posts() {
    return await this.postService.findAll();
  }

  @Get(':id')
  @UseGuards(AccessGuard)
  @UseAbility(Actions.read, Post, PostHook)
  async post(@Param('id') id: string) {
    return await this.postService.findById(id);
  }

  @Put(':id')
  @UseGuards(AccessGuard)
  @UseAbility(Actions.update, Post, PostHook)
  async updatePost(@Param('id') id: string, @Body() updatePostInput: UpdatePostInput) {
    return this.postService.update({ ...updatePostInput, id });
  }
}
