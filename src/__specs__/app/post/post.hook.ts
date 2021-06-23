import { Injectable } from '@nestjs/common';
import { Request, SubjectBeforeFilterHook } from 'nest-casl';

import { PostService } from './post.service';
import { Post } from './dtos/post.dto';

@Injectable()
export class PostHook implements SubjectBeforeFilterHook<Post> {
  constructor(readonly postService: PostService) {}

  async run({ params }: Request) {
    return this.postService.findById(params.input.id);
  }
}
