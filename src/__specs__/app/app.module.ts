import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { CaslModule } from 'nest-casl';

import { PostModule } from './post/post.module';
import { UserModule } from './user/user.module';
import { UserHook } from './user/user.hook';
import { Roles } from './app.roles';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
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
      getUserHook: UserHook,
    }),
    UserModule,
    PostModule,
  ],
})
export class AppModule {}
