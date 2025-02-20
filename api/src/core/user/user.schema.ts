/* eslint-disable @typescript-eslint/no-unused-vars */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { nanoid } from 'nanoid';
import { compare, genSalt, hash as genHash } from 'bcrypt';
import config from 'src/config';
import { emailRegex } from '../constants';

@Schema({ versionKey: false })
export class User {
  @Prop({
    type: String,
    required: true,
    validate: {
      validator: (value: string) => emailRegex.test(value),
    },
  })
  email: string;

  @Prop({ type: String, required: true })
  displayName: string;

  @Prop({ type: String, required: true })
  avatarUrl: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
    required: true,
  })
  role: string;

  @Prop({ type: String, defualt: null })
  googleId: string;

  @Prop({ type: String, default: null })
  token: string | null;

  generateToken(): void {}
  clearToken(): void {}
  checkPassword(password: string): Promise<boolean> {
    return new Promise<boolean>(() => {});
  }
}

export type UserDocument = HydratedDocument<User>;

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.methods.generateToken = function (this: UserDocument) {
  this.token = nanoid();
};

UserSchema.methods.clearToken = function (this: UserDocument) {
  this.token = null;
};

UserSchema.methods.checkPassword = function (
  this: UserDocument,
  password: string,
) {
  return compare(password, this.password);
};

UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  const salt = await genSalt(config.saltWorkFactor);
  const hash = await genHash(this.password, salt);

  this.password = hash;
});

UserSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.password;
    return ret;
  },
});
