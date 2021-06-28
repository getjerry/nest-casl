import { Module } from '@nestjs/common';
import { CaslModule } from 'nest-casl';

import { PostResolver } from './post.resolver';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { permissions } from './post.permissions';

@Module({
  providers: [PostResolver, PostController, PostService],
  controllers: [PostController],
  imports: [CaslModule.forFeature({ permissions })],
})
export class PostModule {}
