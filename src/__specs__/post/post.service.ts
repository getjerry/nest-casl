import { Injectable } from '@nestjs/common';

import { Post } from './dtos/post.dto';
import { CreatePostInput } from './dtos/create-post-input.dto';
import { UpdatePostInput } from './dtos/update-post-input.dto';

@Injectable()
export class PostService {
  async findAll(): Promise<Post[]> {
    return [];
  }

  async findById(id: string): Promise<Post> {
    return new Post();
  }

  async create(input: CreatePostInput): Promise<Post> {
    return new Post();
  }

  async update(input: UpdatePostInput): Promise<Post> {
    return new Post();
  }

  async delete(id: string): Promise<Post> {
    return new Post();
  }
}
