import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { User } from '../core/user/user.schema';

export class Ingredient {
  name: string;
  qty: string;
}

export class Rating {
  user: string;
  rating: number;
}

@Schema({ versionKey: false })
export class Cocktail {
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: User.name,
    required: true,
  })
  user: User;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, default: null })
  imageUrl: string | null;

  @Prop({ type: String, default: null })
  recipe: string | null;

  @Prop({
    type: Boolean,
    required: true,
    default: false,
  })
  isPublished: boolean;

  @Prop({ type: [Ingredient], default: [] })
  ingredients: Ingredient[];

  @Prop({ type: [Rating], default: [] })
  ratings: Rating[];
}

export type CocktailDocument = HydratedDocument<Cocktail>;

export const CocktailSchema = SchemaFactory.createForClass(Cocktail);
