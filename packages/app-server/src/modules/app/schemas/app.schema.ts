import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';

interface AppVersion {
  version: string;
  resources: Resource;
  desc?: string;
  createAt: number;
  config: Record<string, string>;
}

interface CoreAppVersion {
  version: string;
  resources: Resource;
  config: Record<string, string>;
}

type Resource =
  | string[]
  | {
      scripts?: string[];
      styles?: string[];
      html?: string;
    };

@Schema({ timestamps: true, versionKey: false })
export class App {
  @Prop({
    required: true,
    unique: true,
    type: String,
  })
  key: string;

  @Prop({
    required: true,
    unique: true,
    type: String,
  })
  name: string;

  @Prop({
    required: true,
    type: Number,
  })
  type: number;

  @Prop({
    type: SchemaTypes.Mixed,
  })
  logo?: string | { url: string };

  @Prop({
    required: true,
    type: String,
  })
  token: string;

  @Prop({
    required: true,
    type: String,
  })
  createBy: string;

  @Prop({
    required: true,
    type: String,
  })
  owner: string;

  @Prop({
    type: [{ type: String }],
    default: [],
  })
  testUsers: string[];

  @Prop({
    type: String,
  })
  startLocation?: string;

  @Prop({
    type: Object,
  })
  testVersion?: CoreAppVersion;

  @Prop({
    type: Object,
  })
  currentVersion?: CoreAppVersion;

  @Prop({
    type: [{ type: Object }],
  })
  versions: AppVersion[];

  @Prop({
    type: [{ type: String }],
  })
  admins?: string[];

  @Prop({
    type: { type: Object },
  })
  config?: {};

  @Prop({
    type: Date,
    default: Date.now,
  })
  publishedAt?: Date;

  @Prop({
    type: Boolean,
  })
  isDeleted?: boolean = false;
}

export type AppDocument = HydratedDocument<App>;

export const AppSchema = SchemaFactory.createForClass(App);
