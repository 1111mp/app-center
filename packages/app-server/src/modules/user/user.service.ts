import { Model, SchemaTypes, Types } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { isEqual, pick } from 'lodash';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { TokenService } from '@/modules/token/token.service';
import { TokenSource } from '../token/types/token.enum';
import { CreateTokenDto } from '@/modules/token/dto/create-token.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly tokenService: TokenService,
  ) {}

  async findById(id: string | Types.ObjectId) {
    return this.userModel.findById(id);
  }

  async findByToken(token: string) {
    const tokenDocument = await this.tokenService.findByToken(token);

    if (
      tokenDocument?.owner &&
      (tokenDocument.source === TokenSource.USER ||
        tokenDocument.source === TokenSource.DESKTOP)
    ) {
      return this.userModel.findById(tokenDocument.owner);
    }

    return null;
  }

  async upsertOne(userDto: CreateUserDto): Promise<UserDocument> {
    let user = await this.userModel.findOne({ authId: userDto.authId });

    if (!user) {
      user = await this.userModel.create(userDto);
    } else if (!isEqual(pick(user, Object.keys(userDto)), userDto)) {
      user = Object.assign(user, userDto);
      await user.save();
    }

    return user;
  }

  async genUserToken(createTokenDto: CreateTokenDto) {
    const document = await this.tokenService.createOne(createTokenDto);

    const token = document?.token;
    return token;
  }
}
