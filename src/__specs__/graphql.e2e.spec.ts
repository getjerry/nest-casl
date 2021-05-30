import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { Test } from '@nestjs/testing';

import { OptionsForRoot } from '../interfaces/options.interface';
import { PostService } from './post/post.service';
import { PostModule } from './post/post.module';
import { CaslModule } from '../casl.module';
import { Post } from './post/dtos/post.dto';
import { Roles } from './roles';
import { UserModule } from './user/user.module';
import { UserService } from './user/user.service';
import { User } from './user/dtos/user.dto';
import { UserHook } from './user/user.hook';

const getUser = (role: Roles, id: string = 'userId') => ({ id, roles: [role] });

const getPostService = (post: Post) => ({
  findAll: async () => [post],
  findById: async () => post,
  create: async () => post,
  update: async () => post,
  delete: async () => post,
});

const getUserService = (user: User) => ({
  findById: jest.fn(),
});

const createCaslTestingModule = async (
  caslOptions: OptionsForRoot,
  postService: PostService,
  userService: UserService
): Promise<INestApplication> => {
  const moduleRef = await Test.createTestingModule({
    imports: [
      PostModule,
      UserModule,
      GraphQLModule.forRoot({
        autoSchemaFile: true,
        playground: false,
        debug: true,
      }),
      CaslModule.forRoot(caslOptions),
    ],
  })
    .overrideProvider(PostService)
    .useValue(postService)
    .overrideProvider(UserService)
    .useValue(userService)
    .compile();

  const app = moduleRef.createNestApplication();
  await app.init();
  return app;
};

const graphql = (app: INestApplication) => {
  return request(app.getHttpServer()).post('/graphql');
};

const q = (query: string) => ({ query });

const Queries = {
  POST: q('{ post(id: "id") { id userId } }'),
  POSTS: q('{ posts { id userId } }'),
};

const Mutations = {
  CREATE_POST: q('mutation { createPost(input: { userId: "userId" }) { id userId } }'),
  UPDATE_POST: q('mutation { updatePost(input: { id: "id", userId: "userId" }) { id userId } }'),
  UPDATE_POST_NO_HOOK: q('mutation { updatePostNoHook(input: { id: "id", userId: "userId" }) { id userId } }'),
  DELETE_POST: q('mutation { deletePost(id: "id") { id userId } }'),
};

describe('Graphql resolver with authorization', () => {
  const post = { id: 'id', userId: 'userId' };
  const user = { id: 'userId', name: 'John Doe', roles: [] };
  let app: INestApplication;
  let postService: PostService;
  let userService: UserService;

  beforeEach(async () => {
    postService = getPostService(post);
    userService = getUserService(user);
  });

  afterEach(async () => {
    await app.close();
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  // TODO implement specs for anonymous visitor
  describe('without authenticated user', () => {});

  describe('accessed by admin', () => {
    beforeEach(async () => {
      app = await createCaslTestingModule(
        {
          superuserRole: Roles.admin,
          getUserFromRequest: () => getUser(Roles.admin),
        },
        postService,
        userService
      );
    });

    it(`can query post`, () => {
      return graphql(app)
        .send(Queries.POST)
        .expect(200)
        .expect((res) => {
          expect(res.body.data.post).toEqual(post);
        });
    });

    it(`can query posts`, () => {
      return graphql(app)
        .send(Queries.POSTS)
        .expect(200)
        .expect((res) => {
          expect(res.body.data.posts).toEqual([post]);
        });
    });

    it(`can create post`, () => {
      return graphql(app)
        .send(Mutations.CREATE_POST)
        .expect(200)
        .expect((res) => {
          expect(res.body.data.createPost).toEqual(post);
        });
    });

    it(`can update own post`, () => {
      return graphql(app)
        .send(Mutations.UPDATE_POST)
        .expect(200)
        .expect((res) => {
          expect(res.body.data.updatePost).toEqual(post);
        });
    });

    it(`can update other user's post`, async () => {
      const otherUserPost = { ...post, userId: 'otherUserId' };
      app = await createCaslTestingModule(
        {
          superuserRole: Roles.admin,
          getUserFromRequest: () => getUser(Roles.admin),
        },
        getPostService(otherUserPost),
        userService
      );

      return graphql(app)
        .send(Mutations.UPDATE_POST)
        .expect(200)
        .expect((res) => {
          expect(res.body.data.updatePost).toEqual(otherUserPost);
        });
    });

    it(`can delete post`, () => {
      return graphql(app)
        .send(Mutations.DELETE_POST)
        .expect(200)
        .expect((res) => {
          expect(res.body.data.deletePost).toEqual(post);
        });
    });
  });

  describe('accessed by admin with no superuser role configured', () => {
    beforeEach(async () => {
      app = await createCaslTestingModule(
        {
          getUserFromRequest: () => getUser(Roles.admin),
        },
        postService,
        userService
      );
    });

    it(`can query post`, () => {
      return graphql(app)
        .send(Queries.POST)
        .expect(200)
        .expect((res) => {
          expect(res.body.data.post).toEqual(post);
        });
    });

    it(`can query posts`, () => {
      return graphql(app)
        .send(Queries.POSTS)
        .expect(200)
        .expect((res) => {
          expect(res.body.data.posts).toEqual([post]);
        });
    });

    it(`can not update post`, () => {
      return graphql(app)
        .send(Mutations.UPDATE_POST)
        .expect(200)
        .expect((res) => {
          expect(res.body.data).toBeNull();
        });
    });
  });

  describe('accessed by customer', () => {
    beforeEach(async () => {
      app = await createCaslTestingModule(
        {
          getUserFromRequest: () => getUser(Roles.customer),
        },
        postService,
        userService
      );
    });

    it(`can query post`, () => {
      return graphql(app)
        .send(Queries.POST)
        .expect(200)
        .expect((res) => {
          expect(res.body.data.post).toEqual(post);
        });
    });

    it(`can query posts`, () => {
      return graphql(app)
        .send(Queries.POSTS)
        .expect(200)
        .expect((res) => {
          expect(res.body.data.posts).toEqual([post]);
        });
    });

    it(`can create post`, () => {
      return graphql(app)
        .send(Mutations.CREATE_POST)
        .expect(200)
        .expect((res) => {
          expect(res.body.data.createPost).toEqual(post);
        });
    });

    it(`can update own post`, () => {
      return graphql(app)
        .send(Mutations.UPDATE_POST)
        .expect(200)
        .expect((res) => {
          expect(res.body.data.updatePost).toEqual(post);
        });
    });

    it(`can not update other user's post`, async () => {
      const otherUserPost = { ...post, userId: 'otherUserId' };
      app = await createCaslTestingModule(
        {
          getUserFromRequest: () => getUser(Roles.customer),
        },
        getPostService(otherUserPost),
        userService
      );

      return graphql(app)
        .send(Mutations.UPDATE_POST)
        .expect(200)
        .expect((res) => {
          expect(res.body.data).toBeNull();
        });
    });

    it(`can not delete post`, () => {
      return graphql(app)
        .send(Mutations.DELETE_POST)
        .expect(200)
        .expect((res) => {
          expect(res.body.data).toBeNull();
        });
    });
  });

  describe('subject hook', () => {
    beforeEach(async () => {
      app = await createCaslTestingModule(
        {
          getUserFromRequest: () => getUser(Roles.customer),
          getUserHook: UserHook,
        },
        postService,
        userService
      );
    });

    it(`should not be called for ability without conditions`, async () => {
      await graphql(app)
        .send(Queries.POST)
        .expect(200);
      expect(userService.findById).not.toBeCalled()
    });

    it(`should not be called for ability without subject hook`, async () => {
      postService.update = jest.fn();
      await graphql(app)
        .send(Mutations.UPDATE_POST_NO_HOOK)
        .expect(200);
      expect(userService.findById).not.toBeCalled()
    });

    it(`should be called for ability with conditions and subject hook`, async () => {
      await graphql(app)
        .send(Mutations.UPDATE_POST)
        .expect(200);
      expect(userService.findById).toBeCalledWith('userId')
    });
  });

  // TODO user hook
  describe('user hook', () => {
    beforeEach(async () => {
      app = await createCaslTestingModule(
        {
          getUserFromRequest: () => getUser(Roles.customer),
          getUserHook: UserHook,
        },
        postService,
        userService
      );
    });

    it(`should not be called for ability without conditions`, async () => {
      await graphql(app)
        .send(Queries.POST)
        .expect(200);
      expect(userService.findById).not.toBeCalled()
    });

    it(`should not be called for ability without subject hook`, async () => {
      postService.update = jest.fn();
      await graphql(app)
        .send(Mutations.UPDATE_POST_NO_HOOK)
        .expect(200);
      expect(userService.findById).not.toBeCalled()
    });

    it(`should be called for ability with conditions and subject hook`, async () => {
      await graphql(app)
        .send(Mutations.UPDATE_POST)
        .expect(200);
      expect(userService.findById).toBeCalledWith('userId')
    });
  });

  // TODO test CaslUser decorator
  describe('CaslUser decorator', () => {});

  // TODO test CaslSubject decorator
  describe('CaslSubject decorator', () => {});

  // TODO test CaslConditions decorator
  describe('CaslConditions decorator', () => {});
});
