import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class User {
  @Prop({ type: String, required: [true, 'Email is required'] })
  email: string;

  @Prop({ type: String, required: [true, 'Display name is required'] })
  displayName: string;

  @Prop({ type: String, default: null })
  avatarUrl: string | null;

  @Prop({ type: String, required: [true, 'Password is required'] })
  password: string;

  @Prop({
    type: String,
    enum: ['user', 'admin'],
    required: [true, 'Role is required'],
  })
  role: string;

  @Prop({ type: String, defualt: null })
  googleId: string;
}

export type UserDocument = HydratedDocument<User>;

export const UserSchema = SchemaFactory.createForClass(User);
