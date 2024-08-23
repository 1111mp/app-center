import { Model } from 'mongoose';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { valid } from 'semver';

import {
  API_USED_PREFIX,
  ROUTER_USED_PREFIX,
} from '@/constants/prefix.constant';
import { App, AppDocument } from './schemas/app.schema';
import { CreateAppDto } from './dto/create-app.dto';
import { CreateAppVersionDto } from './dto/create-app-version.dto';
import { UserDocument } from '@/modules/user/schemas/user.schema';
import { CacheService } from '@/modules/cache/cache.service';
import { generateToken } from '@/utils/token.util';

import type { AppData } from './types/app-core.type';
import type { AppVersion, CoreAppVersion } from './types/app-version.type';

const WEB_APP_RESERVED_VERSION_COUNT = 50;

@Injectable()
export class AppService {
  constructor(
    private readonly logger: Logger,
    @InjectModel(App.name) private readonly appModel: Model<App>,
    private readonly cacheService: CacheService,
  ) {}

  async getByToken(key: string, token: string) {
    return this.appModel.findOne({ key, token });
  }

  async createOne(createAppDto: CreateAppDto, user: UserDocument) {
    if (API_USED_PREFIX.includes(createAppDto.key)) {
      throw new BadRequestException(
        'App Key cannot use internal reserved prefixes. Please try other route prefixes.',
      );
    }

    if (!user.isAdmin && ROUTER_USED_PREFIX.includes(createAppDto.key)) {
      throw new BadRequestException(
        'App Key cannot use internal reserved prefixes. Please try other route prefixes.',
      );
    }

    const createBy = user._id.toString();
    const app = await this.appModel.create({
      ...createAppDto,
      createBy,
      owner: createBy,
      versions: [],
      token: generateToken(),
    });
    await this.updateAppList();

    return app;
  }

  async createVersion(
    app: AppDocument,
    createAppVersionDto: CreateAppVersionDto,
  ) {
    await this.validateVersion(app, createAppVersionDto.version);

    const { currentVersion, testVersion } = app;
    const lastVersion = currentVersion
      ? app.versions.find(
          (appVersion) => appVersion.version === currentVersion.version,
        )
      : testVersion
        ? app.versions.find(
            (appVersion) => appVersion.version === testVersion.version,
          )
        : app.versions[0];
    const versions = app.versions;
    app.versions = [createAppVersionDto, ...versions];

    /// auto inherit the config data from last version
    if (!createAppVersionDto.config && lastVersion && lastVersion.config) {
      createAppVersionDto.config = lastVersion.config;
    }

    /// Clean up old versions that exceed the maximum number of saved versions
    if (app.versions.length > WEB_APP_RESERVED_VERSION_COUNT) {
      const currentVersion = app.currentVersion?.version
          ? app.currentVersion.version
          : void 0,
        testVersion = app.testVersion?.version
          ? app.testVersion.version
          : void 0;
      const newVersions = [...app.versions],
        usedVersion: AppVersion[] = [],
        needDelVersions: string[] = [];

      while (newVersions.length > WEB_APP_RESERVED_VERSION_COUNT) {
        const last = newVersions.pop();
        if (
          last.version === currentVersion ||
          lastVersion.version === testVersion
        ) {
          usedVersion.unshift(last);
        } else {
          needDelVersions.push(last.version);
        }
      }

      usedVersion.length && newVersions.push(...usedVersion);

      if (needDelVersions) {
        this.logger.log(
          `Clean up old versions that exceed the maximum number of saved versions: ${needDelVersions.join(', ')}`,
        );
        app.versions = newVersions;
      }
    }

    await app.save();

    if (
      (app.currentVersion &&
        app.currentVersion?.version === createAppVersionDto.version) ||
      (app.testVersion &&
        app.testVersion?.version === createAppVersionDto.version)
    ) {
      /// If the versions are consistent, need to refresh the appList data
      await this.updateAppList();
    }
  }

  async updateAppList() {
    const apps = await this.appModel
      .find({ isDeleted: { $ne: true } })
      .sort({ createdAt: 1 });

    const appList: AppData[] = apps
      .filter((app) => app.currentVersion || app.testVersion)
      .map((app) => ({
        id: app._id.toString(),
        key: app.key,
        name: app.name,
        type: app.type,
        logo: typeof app.logo === 'string' ? app.logo : app.logo?.url,
        prefix: `/${app.key}`,
        createBy: app.createBy,
        testUsers: app.testUsers,
        startLocation: app.startLocation,
        publishedAt: app.publishedAt?.getTime(),
        ...this.transformVersion(app.currentVersion, app.versions, false),
        ...this.transformVersion(app.testVersion, app.versions, true),
      }));

    await this.cacheService.updateAppList(appList);
    return appList;
  }

  /**
   * Verify that the version is available
   */
  async validateVersion(app: AppDocument, version: string) {
    if (!version || !valid(version))
      throw new BadRequestException(
        `Invalid version format. Expected a format similar to 1.0.1, but got ${version}.`,
      );

    if (app.versions.find((appVersion) => appVersion.version === version))
      throw new BadRequestException(
        `The version number ${version} already exists in the system. Please use a unique version number.`,
      );
  }

  private transformVersion(
    version: CoreAppVersion,
    versions: AppVersion[],
    isTest: boolean = false,
  ) {
    if (!version) return {};
    const data =
      'version' in version
        ? versions.find((item) => item.version === version.version)
        : version;

    if (data) {
      return {
        [!isTest ? 'resources' : 'testResources']: data.resources,
        [!isTest ? 'versionCreateAt' : 'testVersionCreateAt']:
          'createAt' in data ? data.createAt : void 0,
        [!isTest ? 'version' : 'testVersion']:
          'version' in data ? data.version : void 0,
        [!isTest ? 'config' : 'testConfig']:
          'config' in data ? data.config : void 0,
      };
    }
    return {};
  }
}
