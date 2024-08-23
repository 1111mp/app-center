import { Global, Module } from '@nestjs/common';
import { Model } from 'mongoose';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';

import { CacheService } from './cache.service';
import { createMongooseCacheStore } from './mongoose-cache.store';
import { Cache, CacheDocument, CacheSchema } from './schemas/cache.schema';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cache.name, schema: CacheSchema }]),
    NestCacheModule.registerAsync({
      isGlobal: true,
      useFactory: (cacheModel: Model<CacheDocument>) => ({
        store: { create: createMongooseCacheStore },
        cacheModel,
      }),
      inject: [getModelToken(Cache.name)],
    }),
  ],
  providers: [CacheService],
  exports: [CacheService, MongooseModule],
})
export class CacheModule {}
