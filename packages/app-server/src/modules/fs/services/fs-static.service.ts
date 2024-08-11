import { Readable, Stream } from 'stream';
import { Connection, SchemaTypes } from 'mongoose';
import { UnprocessableEntityException } from '@nestjs/common';
import { IGridFSObject, MongoGridFS } from 'mongo-gridfs';

import { uniq } from 'lodash';
import type { CommonFSInterface, FSMetaData } from '../fs.interface';

export class StaticFSService implements CommonFSInterface {
  private readonly gridFS: MongoGridFS;

  /**
   *
   * @param connection
   * @param bucketName
   * @param redundant
   * @param prefix
   */
  constructor(
    private readonly connection: Connection,
    private readonly bucketName: string,
    private readonly redundant: boolean = false,
    private readonly prefix?: string,
  ) {
    if (!redundant) {
      this.connection.db.collection(bucketName).createIndexes([
        {
          key: { md5: 1 },
        },
      ]);
    }
    this.gridFS = new MongoGridFS(this.connection.db, this.bucketName);
  }

  async getMetaData(scope: string, id: string): Promise<FSMetaData> {
    const fileData = await this.gridFS.findById(id);
    return {
      id,
      scope,
      filename: fileData.filename,
      contentType: fileData.contentType,
      size: fileData.chunkSize,
      extra: fileData.metadata,
      url: this.getFileUrl(scope, fileData.filename),
    };
  }

  async getMetaDataByName(
    scope: string,
    filename: string,
  ): Promise<FSMetaData> {
    const fileData = await this.gridFS.findOne({
      $and: [
        { filename },
        {
          $or: [{ scope }, { scope: { $exists: false } }],
        },
      ],
    });
    return {
      id: fileData._id.toString(),
      scope: fileData.metadata['scope'],
      filename: fileData.filename,
      contentType: fileData.contentType,
      size: fileData.chunkSize,
      extra: fileData.metadata,
      url: this.getFileUrl(scope, fileData.filename),
    };
  }

  async read(id: string): Promise<Stream> {
    return this.gridFS.readFileStream(id);
  }

  async readByName(scope: string, filename: string): Promise<Stream> {
    const metadata = await this.getMetaDataByName(scope, filename);
    return this.gridFS.readFileStream(metadata.id);
  }

  async write(
    scope: string,
    filename: string,
    content: string | Buffer | Stream,
    extra: FSMetaData['extra'],
  ): Promise<FSMetaData> {
    let fileData: IGridFSObject | null = null;
    if (!this.redundant) {
      if (!extra.md5)
        throw new UnprocessableEntityException(
          'write non-redundant gridfs must pass md5',
        );

      if (!extra.referrer)
        throw new UnprocessableEntityException(
          'write non-redundant gridfs must pass referrer',
        );

      try {
        fileData = await this.gridFS.findOne({
          md5: extra.md5,
          'metadata.scope': scope,
        });
      } catch (err) {}
    }

    if (fileData) {
      const referrers = uniq([
        ...fileData.metadata['referrers'],
        extra?.referrer,
      ]);
      await this.updateReferrers(fileData._id.toString(), referrers);
    } else {
      content =
        content instanceof Buffer
          ? Readable.from(content)
          : typeof content === 'string'
            ? Readable.from([content])
            : content;

      fileData = await this.gridFS.writeFileStream(content, {
        filename,
        contentType: extra.mimetype,
        metadata: {
          ...extra,
          scope,
          referrers: [extra.referrer],
        },
      });
    }

    return {
      id: fileData._id.toString(),
      scope,
      filename: fileData.filename,
      contentType: fileData.contentType,
      size: fileData.chunkSize,
      extra: fileData.metadata,
      url: this.getFileUrl(scope, fileData.filename),
    };
  }

  async remove(scope: string, id: string, referrer?: string) {
    if (!this.redundant) {
      if (!referrer)
        throw new UnprocessableEntityException(
          'remove file from non-redundant gridfs must pass referrer',
        );

      const metadata = await this.getMetaData(scope, id);
      const referrers = (metadata.extra?.referrers ?? []).filter(
        (item) => item !== referrer,
      );

      if (referrers.length) {
        if (referrers.length !== metadata.extra.referrers.length) {
          await this.updateReferrers(id, referrers);
        }
        return;
      }
    }

    const objectId = new SchemaTypes.ObjectId(id);
    await this.connection.db
      .collection(`${this.bucketName}.chunks`)
      .deleteMany({ files_id: objectId });
    await this.connection.db
      .collection(`${this.bucketName}.files`)
      .deleteOne({ _id: objectId });
  }

  async removeByName(
    scope: string,
    filename: string,
    referrer?: string,
  ): Promise<void> {
    const metadata = await this.getMetaDataByName(scope, filename);
    return this.remove(scope, metadata.id, referrer);
  }

  async removeFilesByScope(scope: string) {
    const list = await this.gridFS.find({ 'metadata.scope': scope });
    for (const item of list) {
      try {
        await this.connection.db
          .collection(`${this.bucketName}.chunks`)
          .deleteMany({ files_id: item._id });
        await this.connection.db
          .collection(`${this.bucketName}.files`)
          .deleteOne({ _id: item._id });
      } catch (e) {
        // nothing
      }
    }
    return;
  }

  private async updateReferrers(id: string, referrers: string[]) {
    await this.connection.db
      .collection(`${this.bucketName}.files`)
      .updateOne(
        { _id: new SchemaTypes.ObjectId(id) },
        { $set: { 'metadata.referrers': referrers } },
      );
  }

  private getFileUrl(scope: string, filename: string) {
    if (!this.prefix) {
      return;
    }
    return `${this.prefix}/${scope}/${filename}`;
  }
}
