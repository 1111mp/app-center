import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { TokenSource, TokenType } from '../types/token.enum';

@Schema({ timestamps: true, versionKey: false })
export class Token {
  @Prop({
    required: true,
    type: String,
  })
  owner: string;

  @Prop({
    required: true,
    type: Number,
  })
  source: TokenSource;

  @Prop({
    required: true,
    type: Number,
  })
  type: TokenType;

  @Prop({
    type: Number,
    default: 0,
    index: 1,
  })
  expired: number;

  @Prop({
    required: true,
    unique: true,
    type: String,
  })
  token: string;

  /**
   * Additional information to record.
   */
  @Prop({
    type: Object,
  })
  extra: Record<string, any>;
}

export type TokenDocument = HydratedDocument<Token>;

export const TokenSchema = SchemaFactory.createForClass(Token);
