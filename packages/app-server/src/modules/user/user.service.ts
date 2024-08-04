import { Model, SchemaTypes, Types } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { isEqual, pick } from 'lodash';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModule: Model<User>,
  ) {}

  async findById(id: string | Types.ObjectId) {
    return this.userModule.findById(id);
  }

  async upsertOne(userDto: CreateUserDto): Promise<UserDocument> {
    let user = await this.userModule.findOne({ authId: userDto.authId });

    if (!user) {
      user = await this.userModule.create(userDto);
    } else if (!isEqual(pick(user, Object.keys(userDto)), userDto)) {
      user = Object.assign(user, userDto);
      await user.save();
    }

    return user;
  }
}
