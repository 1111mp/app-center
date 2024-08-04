import { Strategy } from 'passport-github2';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import { UserService } from '@/modules/user/user.service';

interface GithubInfo {
  id: string;
  displayName: string;
  username: string;
  provider: string;
  _json: {
    email?: string;
    avatar_url?: string;
  };
}

@Injectable()
export class GitHubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      clientID: configService.get<string>('GITHUB_CLIENT_ID'),
      clientSecret: configService.get<string>('GITHUB_CLIENT_SECRET'),
      callbackURL: configService.get<string>('GITHUB_CALLBACK_URL'),
      state: false,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: GithubInfo,
  ) {
    const { _json } = profile;
    const user = await this.userService.upsertOne({
      authId: profile.id,
      provider: profile.provider,
      displayName: profile.displayName,
      username: profile.displayName,
      avatar: _json.avatar_url,
      email: _json.email,
    });

    return user;
  }
}
