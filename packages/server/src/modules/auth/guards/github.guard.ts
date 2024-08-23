import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard, type IAuthModuleOptions } from '@nestjs/passport';
import { Request } from 'express';

@Injectable()
export class GithubGuard extends AuthGuard('github') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const activate = (await super.canActivate(context)) as boolean;

    if (activate) {
      const request = context.switchToHttp().getRequest();

      await super.logIn(request);
    }

    return activate;
  }

  getAuthenticateOptions(context: ExecutionContext): IAuthModuleOptions {
    const req = context.switchToHttp().getRequest<Request>();
    const state = { redirect: req.query.redirect };

    return {
      lang: req.query.lang,
      state: Buffer.from(JSON.stringify(state)).toString('base64'),
    };
  }
}
