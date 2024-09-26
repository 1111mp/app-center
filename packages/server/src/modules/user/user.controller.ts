import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';

import { UserService } from './user.service';
import { UserDocument } from './schemas/user.schema';
import { UserInfo } from '@/decorators/user-info.decorator';
import { UserLoggedGuard } from '@/guards/user-logged.guard';
import { CreateUserTokenDto } from '@/modules/token/dto/create-token.dto';
import { TokenSource } from '../token/types/token.enum';

@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(UserLoggedGuard)
  @Post('token')
  genUserToken(
    @UserInfo() user: UserDocument,
    @Body() createUserTokenDto: CreateUserTokenDto,
  ) {
    return this.userService.genUserToken({
      ...createUserTokenDto,
      owner: user._id.toString(),
      source: TokenSource.USER,
    });
  }

  @UseGuards(UserLoggedGuard)
  @Get('current')
  async getCurrentUser(@UserInfo() user: UserDocument) {
    return user.publicData;
  }
}
