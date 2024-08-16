import { Model } from 'mongoose';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { valid } from 'semver';

import { App, AppDocument } from './schemas/app.schema';
import { CreateAppDto } from './dto/create-app.dto';
import { generateToken } from '@/utils/token.util';
import {
  API_USED_PREFIX,
  ROUTER_USED_PREFIX,
} from '@/constants/prefix.constant';
import { UserDocument } from '@/modules/user/schemas/user.schema';
import { CreateAppVersionDto } from './dto/create-app-version.dto';
import type { AppVersion } from './types/app-version.type';

const WEB_APP_RESERVED_VERSION_COUNT = 50;

@Injectable()
export class AppService {
  constructor(
    private readonly logger: Logger,
    @InjectModel(App.name) private readonly appModel: Model<App>,
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
    return this.appModel.create({
      ...createAppDto,
      createBy,
      owner: createBy,
      versions: [],
      token: generateToken(),
    });
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
}
