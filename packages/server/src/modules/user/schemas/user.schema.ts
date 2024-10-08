import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { pick } from 'lodash';

@Schema({ timestamps: true, versionKey: false })
export class User {
  @Prop({
    required: true,
    unique: true,
    type: String,
  })
  authId: string;

  @Prop({
    required: true,
    type: String,
  })
  provider: string;

  @Prop({
    required: true,
    type: String,
  })
  username: string;

  @Prop({
    type: String,
  })
  displayName?: string;

  @Prop({
    type: String,
  })
  avatar?: string;

  @Prop({
    type: String,
  })
  email?: string;

  @Prop({
    type: Boolean,
  })
  isAdmin: boolean;

  @Prop({
    type: Boolean,
  })
  disabled?: boolean;

  publicData: Record<string, any>;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.virtual('publicData').get(function (this: UserDocument) {
  return pick(this, [
    'authId',
    'username',
    'displayName',
    'avatar',
    'email',
    'createdAt',
    'updatedAt',
  ]);
});

export type UserDocument = HydratedDocument<User> & {
  publicData: Record<string, any>;
};
