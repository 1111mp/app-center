import { Module } from '@nestjs/common';
import { OpenApiController } from './open-api.controller';
import { AppModule } from '@/modules/app/app.module';
import { FileModule } from '@/modules/file/file.module';

@Module({
  imports: [AppModule, FileModule],
  controllers: [OpenApiController],
})
export class OpenApiModule {}
