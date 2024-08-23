import { Logger, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GitHubStrategy } from './strategys/github.strategy';
import { GithubGuard } from './guards/github.guard';
import { AuthSerializer } from './auth.serializer';
import { UserModule } from '@/modules/user/user.module';

@Module({
  imports: [
    UserModule,
    PassportModule.register({ defaultStrategy: 'github', session: true }),
  ],
  controllers: [AuthController],
  providers: [Logger, AuthService, AuthSerializer, GitHubStrategy, GithubGuard],
})
export class AuthModule {}
