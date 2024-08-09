import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { generateToken } from '@/utils/token.util';
import { TokenType } from './types/token.enum';
import { CreateTokenDto } from './dto/create-token.dto';
import { Token, TokenDocument } from './schemas/token.schema';

@Injectable()
export class TokenService {
  constructor(
    @InjectModel(Token.name) private readonly tokenModel: Model<Token>,
  ) {}

  async createOne(tokenDto: CreateTokenDto) {
    return this.tokenModel.create({
      ...tokenDto,
      token: generateToken(),
    });
  }

  async findByToken(token) {
    const data = await this.tokenModel.findOne({ token });

    if (data && (await this.validate(data))) {
      return data;
    }

    return null;
  }

  async validate(token: TokenDocument | string): Promise<boolean> {
    const document =
      typeof token === 'string'
        ? await this.tokenModel.findOne({ token })
        : token;

    if (!document) return false;

    switch (document.type) {
      case TokenType.FOREVER: {
        return true;
      }
      case TokenType.ONE_TIME: {
        await document.deleteOne();
        return true;
      }
      case TokenType.TIME_LIMITED: {
        return document.expired >= Date.now();
      }
      default: {
        return false;
      }
    }
  }
}
