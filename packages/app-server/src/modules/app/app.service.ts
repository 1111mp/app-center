import { Model } from 'mongoose';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { App } from './schemas/app.schema';
import { CreateAppDto } from './dto/create-app.dto';
import { generateToken } from '@/utils/token.util';
import {
  API_USED_PREFIX,
  ROUTER_USED_PREFIX,
} from '@/constants/prefix.constant';
import { UserDocument } from '@/modules/user/schemas/user.schema';

@Injectable()
export class AppService {
  constructor(@InjectModel(App.name) private readonly appModule: Model<App>) {}

  async getByToken(key: string, token: string) {
    return this.appModule.findOne({ key, token });
  }

  async createOne(createAppDto: CreateAppDto, user: UserDocument) {
    if (API_USED_PREFIX.includes(createAppDto.key)) {
      throw new BadRequestException(
        'App Key cannot use internal reserved prefixes. Please try other route prefixes.',
      );
    }

    if (!user.isAdmin && ROUTER_USED_PREFIX.includes(createAppDto.key)) {
      throw new BadRequestException(
        'App Key cannot use internal reserved prefixes. Please try other route prefixes.',
      );
    }

    const createBy = user._id.toString();
    return this.appModule.create({
      ...createAppDto,
      createBy,
      owner: createBy,
      versions: [],
      token: generateToken(),
    });
  }
}
