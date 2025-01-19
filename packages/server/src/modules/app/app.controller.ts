import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { UserInfo } from '@/decorators/user-info.decorator';
import { UserDocument } from '@/modules/user/schemas/user.schema';
import { UserLoggedGuard } from '@/guards/user-logged.guard';

import { CreateAppDto } from './dto/create-app.dto';
import { QueryAppDto } from './dto/query-app.dto';
import { UpdateAppDto } from './dto/update-app.dot';

@Controller('api/app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(UserLoggedGuard)
  @Post()
  async create(
    @Body() createAppDto: CreateAppDto,
    @UserInfo() user: UserDocument,
  ) {
    console.log('user', user);
    return this.appService.createOne(createAppDto, user);
  }

  @UseGuards(UserLoggedGuard)
  @Post(':id')
  async updateApp(@Param('id') id: string, @Body() updateAppDto: UpdateAppDto) {
    return this.appService.updateOne(id, updateAppDto);
  }

  @UseGuards(UserLoggedGuard)
  @Get(':id')
  async getApp(@Param('id') id: string) {
    return this.appService.getOne(id);
  }

  @UseGuards(UserLoggedGuard)
  @Get()
  async appList(@Query() queryAppDto: QueryAppDto) {
    return this.appService.appList(queryAppDto);
  }

  @UseGuards(UserLoggedGuard)
  @Delete(':id')
  async appDelete(@Param('id') id: string) {
    console.log(id);
    return this.appService.deleteOne(id);
  }
}
