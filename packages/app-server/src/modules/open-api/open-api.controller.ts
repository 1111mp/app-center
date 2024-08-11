import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { AppData } from '@/decorators/app-data.decorator';
import { AppDocument } from '@/modules/app/schemas/app.schema';
import { AppTokenGuard } from '@/guards/app-token.guard';
import { FileService } from '@/modules/file/file.service';

@Controller('open-api')
export class OpenApiContriller {
  constructor(private readonly fileService: FileService) {}

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
  ) {}
}
