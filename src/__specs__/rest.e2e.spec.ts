import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

import { PostService } from './app/post/post.service';
import { PostModule } from './app/post/post.module';
import { CaslModule } from '../casl.module';
import { Roles } from './app/app.roles';
import { UserModule } from './app/user/user.module';
import { UserService } from './app/user/user.service';
import { User } from './app/user/dtos/user.dto';
import { Post } from './app/post/dtos/post.dto';

const getUser = (role: Roles, id = 'userId') => ({ id, roles: [role] });

const getPostService = (post: Post) => ({
  findAll: jest.fn().mockImplementation(async () => [post]),
  findById: jest.fn().mockImplementation(async () => post),
  create: jest.fn().mockImplementation(async () => post),
  update: jest.fn().mockImplementation(async () => post),
  addUser: jest.fn().mockImplementation(async () => post),
  delete: jest.fn().mockImplementation(async () => post),
});

const getUserService = (user: User) => ({
  findById: jest.fn(async () => user),
});

describe('REST controller with CASL authorization', () => {
  const post = { id: 'id', userId: 'userId', title: 'Post title' };
  const user = { id: 'userId', name: 'John Doe', roles: [] };

  let app: INestApplication;
  let postService: PostService;
  let userService: UserService;

  afterEach(async () => {
    await app.close();
  });

  beforeEach(async () => {
    postService = getPostService(post);
    userService = getUserService(user);
    const moduleRef = await Test.createTestingModule({
      imports: [
        PostModule,
        UserModule,
        CaslModule.forRootAsync<Roles>({
          useFactory: () => ({
            getUserFromRequest: () => getUser(Roles.customer),
          }),
        }),
      ],
    })
      .overrideProvider(PostService)
      .useValue(postService)
      .overrideProvider(UserService)
      .useValue(userService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it(`allows /GET posts`, async () => {
    return request(app.getHttpServer())
      .get('/posts')
      .expect(200)
      .expect(async (res) => {
        expect(res.body).toEqual(await postService.findAll());
      });
  });

  it(`allows /PUT posts/:id`, async () => {
    return request(app.getHttpServer()).put('/posts/postId').expect(200);
  });
});
