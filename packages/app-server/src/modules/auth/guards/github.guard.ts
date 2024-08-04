import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { randomBytes } from 'node:crypto';
import { Request } from 'express';

@Injectable()
export class GithubGuard extends AuthGuard('github') {
  getAuthenticateOptions(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<Request>();
    const state = { redirect: req.query.redirect };

    return {
      lang: req.query.lang,
      state: Buffer.from(JSON.stringify(state)).toString('base64'),
    };
  }
}
