import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { AppData } from '@/decorators/app-data.decorator';
import { AppDocument } from '@/modules/app/schemas/app.schema';
import { AppTokenGuard } from '@/guards/app-token.guard';
import { AppService } from '@/modules/app/app.service';
import { FileService } from '@/modules/file/file.service';
import { CreateAppVersionDto } from '@/modules/app/dto/create-app-version.dto';

@Controller('open-api')
export class OpenApiController {
  constructor(
    private readonly appService: AppService,
    private readonly fileService: FileService,
  ) {}

  @UseGuards(AppTokenGuard)
  @Post('file/upload')
  @UseInterceptors(FileInterceptor('file'))
  async fileUpload(
    @UploadedFile() file: Express.Multer.File,
    @Body('filePath') filePath: string,
    @AppData() app: AppDocument,
  ) {
    return this.fileService.uploadStaticFile(file, app.key, filePath);
  }

  @UseGuards(AppTokenGuard)
  @Post('app/create-version')
  async createAppVersion(
    @Body() createAppVersionDto: CreateAppVersionDto,
    @AppData() app: AppDocument,
  ) {
    return this.appService.createVersion(app, createAppVersionDto);
  }

  @UseGuards(AppTokenGuard)
  @Get('app/validate-version')
  async validateVersion(
    @Query('version') version: string,
    @AppData()
    app: AppDocument,
  ) {
    await this.appService.validateVersion(app, version);
  }
}
