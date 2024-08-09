import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import type { Request } from 'express';
import { IS_PUBLIC_KEY } from '@/decorators/api-public.decorator';
import { UserService } from '@/modules/user/user.service';

@Injectable()
export class UserTokenGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly userService: UserService,
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
    const token = request.headers['user-private-token'] as string;

    if (token) {
      const user = await this.userService.findByToken(token);

      if (user) {
        request.user = user;

        return true;
      }
    }

    throw new ForbiddenException();
  }
}
