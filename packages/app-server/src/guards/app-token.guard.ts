import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import type { Request } from 'express';
import { IS_PUBLIC_KEY } from '@/decorators/api-public.decorator';
import { AppService } from '@/modules/app/app.service';

@Injectable()
export class AppTokenGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly appService: AppService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const appKey = request.headers['app-private-key'] as string;
    const appToken = request.headers['app-private-token'] as string;

    if (appKey && appToken) {
      const app = await this.appService.getByToken(appKey, appToken);

      if (app) {
        request.appData = app;

        return true;
      }
    }

    throw new ForbiddenException();
  }
}
