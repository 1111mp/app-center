import { Inject, Injectable } from '@nestjs/common';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

import type { AppData } from '../app/types/app-core.type';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async findAppList() {
    return this.cacheManager.get<AppData[]>('app_list');
  }

  async updateAppList(appList: AppData[]) {
    /// never expired
    return this.cacheManager.set('app_list', appList, 0);
  }
}
