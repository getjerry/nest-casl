import { Injectable } from '@nestjs/common';

import { User } from './dtos/user.dto';

@Injectable()
export class UserService {
  async findById(id: string): Promise<User> {
    return new User();
  }
}
