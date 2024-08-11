import { NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { MutableFSDocument } from '../schemas/mutable-fs.schema';

import type { CommonFSInterface, FSMetaData } from '../fs.interface';
import { Stream } from 'stream';

export class MutableFSService implements CommonFSInterface {
  constructor(
    private readonly mutableFSModel: Model<MutableFSDocument>,
    private readonly bucketName: string,
  ) {}

  async getMetaData(scope: string, id: string): Promise<FSMetaData> {
    const data = await this.mutableFSModel
      .findOne({
        _id: id,
        bucketName: this.bucketName,
      })
      .select({ content: 0 });
    if (!data)
      throw new NotFoundException(
        `could not find file with id ${id}，scope is ${scope}`,
      );

    return data.toObject({ virtuals: true }).metadata;
  }

  getMetaDataByName(scope: string, filename: string): Promise<FSMetaData> {
    throw new Error('Method not implemented.');
  }

  read(id: string): Promise<Stream> {
    throw new Error('Method not implemented.');
  }

  readByName(scope: string, filename: string): Promise<Stream> {
    throw new Error('Method not implemented.');
  }

  write(
    scope: string,
    filename: string,
    content: string | Buffer | Stream,
    extra: FSMetaData['extra'],
  ): Promise<FSMetaData> {
    throw new Error('Method not implemented.');
  }

  remove(scope: string, id: string, referrer?: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  removeByName(
    scope: string,
    filename: string,
    referrer?: string,
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }

  removeFilesByScope(scope: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
