import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { UserInfo } from '@/decorators/user-info.decorator';
import { UserDocument } from '@/modules/user/schemas/user.schema';
import { UserLoggedGuard } from '@/guards/user-logged.guard';

import { CreateAppDto } from './dto/create-app.dto';
import { QueryAppDto } from './dto/query-app.dto';

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

  @UseGuards(UserLoggedGuard)
  @Get()
  async appList(@Query() queryAppDto: QueryAppDto) {
    return this.appService.appList(queryAppDto);
  }
}
