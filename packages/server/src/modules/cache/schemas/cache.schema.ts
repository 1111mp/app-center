import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';

@Schema({ versionKey: false })
export class Cache {
  @Prop({
    required: true,
    unique: true,
    type: String,
  })
  key: string;

  @Prop({
    required: true,
    type: SchemaTypes.Mixed,
  })
  value: any;

  @Prop({
    type: Number,
  })
  expireAt?: number;
}

export type CacheDocument = HydratedDocument<Cache>;

export const CacheSchema = SchemaFactory.createForClass(Cache);
