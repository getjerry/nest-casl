import { Injectable } from '@nestjs/common';
import { BeforeFilterHook } from '../../interfaces/hooks.interface';
import { RequestWithIdentity } from '../../interfaces/options.interface';

import { Post } from './dtos/post.dto';
import { PostService } from './post.service';

@Injectable()
export class PostHook implements BeforeFilterHook<Post> {
  constructor(readonly postService: PostService) {}

  run(request: RequestWithIdentity) {
    return this.postService.findById(request.id);
  }
}
