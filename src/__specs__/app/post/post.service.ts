/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';

import { Post } from './dtos/post.dto';
import { CreatePostInput } from './dtos/create-post-input.dto';
import { UpdatePostInput } from './dtos/update-post-input.dto';
import { User } from '../user/dtos/user.dto';

@Injectable()
export class PostService {
  async findAll(): Promise<Post[]> {
    return [];
  }

  async findById(id?: string): Promise<Post> {
    return new Post();
  }

  async create(input: CreatePostInput): Promise<Post> {
    return new Post();
  }

  async update(input: UpdatePostInput, conditions?: [string, unknown[], string[]]): Promise<Post> {
    return new Post();
  }

  async addUser(user: User | undefined): Promise<Post> {
    return new Post();
  }

  async delete(id: string): Promise<Post> {
    return new Post();
  }
}
