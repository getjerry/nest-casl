import { Actions, Permissions } from '../../interfaces/permissions.interface';
import { Post } from './dtos/post.dto';
import { Roles } from '../roles';

export const permissions: Permissions<Roles, Post, Actions> = {
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
