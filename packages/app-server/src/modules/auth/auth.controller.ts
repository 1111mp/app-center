import {
  Controller,
  Get,
  HttpCode,
  Logger,
  Next,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { GithubGuard } from './guards/github.guard';
import { UserInfo } from '@/decorators/user-info.decorator';
import { UserDocument } from '@/modules/user/schemas/user.schema';

@Controller('api/oauth')
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
      console.log(redirect);

      resp.redirect(redirect || '/');
    } else {
      resp.redirect('/');
    }
  }

  @Get('logout')
  @HttpCode(204)
  async logout(
    @Req() req: Request,
    @Res() res: Response,
    @Query('redirect') redirect?: string,
  ) {
    req.logout(() => {});

    if (redirect) {
      res.redirect(redirect);
    } else {
      return;
    }
  }
}
