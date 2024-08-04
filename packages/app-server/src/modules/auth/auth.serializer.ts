import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';

import { UserDocument } from '@/modules/user/schemas/user.schema';
import { UserService } from '@/modules/user/user.service';

@Injectable()
export class AuthSerializer extends PassportSerializer {
  constructor(private readonly userService: UserService) {
    super();
  }

  serializeUser(user: UserDocument, done: CallableFunction) {
    done(null, user._id.toString());
  }

  async deserializeUser(userId: string, done: CallableFunction) {
    const user = await this.userService.findById(userId);

    done(null, user);
  }
}
