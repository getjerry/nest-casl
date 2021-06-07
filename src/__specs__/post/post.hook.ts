import { Injectable } from '@nestjs/common';

import { SubjectBeforeFilterHook } from '../../interfaces/hooks.interface';
import { AuthorizableRequest } from '../../interfaces/options.interface';
import { PostService } from './post.service';
import { Post } from './dtos/post.dto';

@Injectable()
export class PostHook implements SubjectBeforeFilterHook<Post> {
  constructor(readonly postService: PostService) {}

  async run({ params }: AuthorizableRequest) {
    return this.postService.findById(params.input.id);
  }
}
