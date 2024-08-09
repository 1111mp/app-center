import { Module } from '@nestjs/common';
import { OpenApiContriller } from './open-api.controller';

@Module({
  controllers: [OpenApiContriller],
})
export class OpenApiController {}
