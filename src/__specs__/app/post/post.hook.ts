import { Injectable } from '@nestjs/common';
import { Request, SubjectBeforeFilterHook } from 'nest-casl';

import { PostService } from './post.service';
import { Post } from './dtos/post.dto';

@Injectable()
export class PostHook implements SubjectBeforeFilterHook<Post, Request> {
  constructor(readonly postService: PostService) {}

  async run({ params }: Request): Promise<Post> {
    return this.postService.findById(params.id || params.input.id);
  }
}
