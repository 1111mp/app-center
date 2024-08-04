import {
  Controller,
  Get,
  Logger,
  Next,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';

import { GithubGuard } from './guards/github.guard';
import { UserInfo } from '@/decorators/user-info.decorator';
import { UserDocument } from '@/modules/user/schemas/user.schema';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly logger: Logger) {}

  @Get('github')
  @UseGuards(GithubGuard)
  login() {}

  @Get('github/callback')
  @UseGuards(GithubGuard)
  callback(
    @UserInfo() user: UserDocument,
    @Res() resp: Response,
    @Query('state') state?: string,
  ) {
    this.logger.log('user login', user);

    if (state) {
      const { redirect } = JSON.parse(Buffer.from(state, 'base64').toString());

      resp.redirect(redirect || '/');
    } else {
      resp.redirect('/');
    }
  }
}
