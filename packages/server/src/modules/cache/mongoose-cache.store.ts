import { CacheStore, CacheStoreSetOptions } from '@nestjs/cache-manager';
import { Model } from 'mongoose';
import { CacheDocument } from './schemas/cache.schema';

interface StoreOptions {
  cacheModel: Model<CacheDocument>;
  /// default 5000 millisecond
  ttl: number;
  prefix?: string;
}

class MongooseCacheStore implements CacheStore {
  private readonly cacheModel: Model<CacheDocument>;
  private readonly ttl: number;
  private readonly prefix?: string;

  constructor(options: StoreOptions) {
    this.cacheModel = options.cacheModel;
    this.ttl = options.ttl;
    this.prefix = options.prefix;
  }

  private getKey(key: string) {
    return this.prefix ? `${this.prefix}_${key}` : key;
  }

  async set<T>(
    key: string,
    value: T,
    options?: CacheStoreSetOptions<T> | number,
  ) {
    const ttl =
      typeof options === 'number'
        ? options
        : typeof options?.ttl === 'function'
          ? options.ttl(value)
          : options?.ttl;
    const expireAt =
      ttl === void 0
        ? Date.now() + this.ttl
        : ttl === 0
          ? void 0
          : Date.now() + ttl;

    await this.cacheModel.findOneAndUpdate(
      { key: this.getKey(key) },
      {
        value,
        expireAt,
      },
      {
        new: true,
        upsert: true,
      },
    );
  }

  async get<T>(key: string): Promise<T | undefined> {
    const cache = await this.cacheModel.findOne({ key: this.getKey(key) });
    if (cache?.expireAt && cache.expireAt < Date.now()) {
      /// expired
      await this.del(this.getKey(key));
      return void 0;
    }
    return cache?.value as T;
  }

  async del(key: string) {
    await this.cacheModel.deleteOne({ key: this.getKey(key) });
  }
}

export function createMongooseCacheStore(options: StoreOptions) {
  return new MongooseCacheStore(options);
}
