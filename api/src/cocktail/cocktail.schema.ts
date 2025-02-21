import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { User } from '../core/user/user.schema';

@Schema({ versionKey: false })
export class Cocktail extends Document<Types.ObjectId> {
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: User.name,
    required: true,
  })
  user: User;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: false, default: null })
  imageUrl: string | null;

  @Prop({ type: String, required: true })
  recipe: string;

  @Prop({
    type: Boolean,
    default: false,
    required: true,
  })
  isPublished: boolean;

  @Prop({
    type: [{ name: { type: String, required: true }, qty: String }],
    default: [],
    required: true,
  })
  ingredients: { name: string; qty: string | null }[];

  @Prop({
    type: [
      {
        user: { type: SchemaTypes.ObjectId, ref: User.name, required: true },
        rating: SchemaTypes.Int32,
      },
    ],
    default: [],
  })
  ratings: { user: Types.ObjectId; rating: number }[];
}

export type CocktailDocument = HydratedDocument<Cocktail>;

export const CocktailSchema = SchemaFactory.createForClass(Cocktail);
