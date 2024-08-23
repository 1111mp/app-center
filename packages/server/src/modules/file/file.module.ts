import { Module } from '@nestjs/common';

import { FileController } from './file.controller';
import { FileService } from './file.service';
import { FSModule } from '@/modules/fs/fs.module';

@Module({
  imports: [FSModule],
  controllers: [FileController],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}
