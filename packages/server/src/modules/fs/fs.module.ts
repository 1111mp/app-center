import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Connection } from 'mongoose';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';

import { FS_STATIC_SERVICE } from './fs.constant';
import { StaticFSService } from './services/fs-static.service';
import { MutableFS, MutableFSSchema } from './schemas/mutable-fs.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MutableFS.name, schema: MutableFSSchema },
    ]),
  ],
  providers: [
    {
      provide: FS_STATIC_SERVICE,
      useFactory: (configService: ConfigService, connection: Connection) => {
        return new StaticFSService(
          connection,
          'static',
          false,
          `${configService.get<string>('SERVER_BASE_URL')}/api/file/static`,
        );
      },
      inject: [ConfigService, getConnectionToken()],
    },
  ],
  exports: [FS_STATIC_SERVICE],
})
export class FSModule {}
