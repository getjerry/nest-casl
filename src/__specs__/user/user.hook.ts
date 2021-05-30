import { Injectable } from '@nestjs/common';

import { BeforeFilterHook } from '../../interfaces/hooks.interface';
import { User } from './dtos/user.dto';
import { UserService } from './user.service';

@Injectable()
export class UserHook implements BeforeFilterHook<User> {
  constructor(readonly userService: UserService) {}

  async run(request: any) { // TODO any
    return this.userService.findById(request.caslUser.id);
  }
}
