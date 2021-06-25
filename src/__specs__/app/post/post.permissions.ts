import { Actions, Permissions, InferSubjects } from 'nest-casl';

import { Roles } from '../app.roles';
import { Post } from './dtos/post.dto';

type Subjects = InferSubjects<typeof Post>;

export const permissions: Permissions<Roles, Subjects, Actions> = {
  everyone({ can }) {
    can(Actions.read, Post);
  },
  customer({ user, can }) {
    can(Actions.create, Post);
    can(Actions.update, Post, { userId: user.id });
  },
  operator({ can, cannot }) {
    can(Actions.manage, Post);
    cannot(Actions.delete, Post);
  },
};
