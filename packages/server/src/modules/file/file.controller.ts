import { Controller, Get, Param, Res } from '@nestjs/common';

import { FileService } from './file.service';
import type { Response } from 'express';

@Controller('api/file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get('static/:scope/*filename')
  async readStatic(
    @Param('scope') scope: string,
    @Param('filename') filename: string[],
    @Res() resp: Response,
  ) {
    return this.fileService.readStatic(scope, filename.join('/'), resp);
  }
}
