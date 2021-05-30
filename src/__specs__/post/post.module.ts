import { Module } from '@nestjs/common';
import { CaslModule } from '../../casl.module';

import { PostResolver } from './post.resolver';
import { PostService } from './post.service';
import { permissions } from './post.permissions';

@Module({
  providers: [PostResolver, PostService],
  imports: [CaslModule.forFeature({ permissions })],
})
export class PostModule {}
