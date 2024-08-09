import { Body, Controller, Post, UseGuards } from '@nestjs/common';

import { AppService } from './app.service';
import { CreateAppDto } from './dto/create-app.dto';
import { UserInfo } from '@/decorators/user-info.decorator';
import { UserDocument } from '@/modules/user/schemas/user.schema';
import { UserLoggedGuard } from '@/guards/user-logged.guard';

@Controller('api/app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(UserLoggedGuard)
  @Post()
  async create(
    @Body() createAppDto: CreateAppDto,
    @UserInfo() user: UserDocument,
  ) {
    const app = this.appService.createOne(createAppDto, user);
    return app;
  }
}
