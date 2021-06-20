import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { CaslModule, AuthorizableRequest, UserBeforeFilterHook } from 'nest-casl';

import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { Roles } from './app.roles';
import { UserService } from './user/user.service';

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: true,
      useGlobalPrefix: false,
      playground: false,
      context: ({ req }) => ({ req }),
    }),
    CaslModule.forRoot<Roles>({
      superuserRole: Roles.admin,
      getUserFromRequest(request) {
        return request.user;
      },
      getUserHook: [UserService, async (service: UserService, user) => {
        return service.findById(user.id);
      }],
    }),
    UserModule,
    PostModule,
  ],
})
export class AppModule {}
