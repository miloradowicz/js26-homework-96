import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Cocktail, CocktailSchema } from 'src/cocktail/cocktail.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Cocktail.name, schema: CocktailSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class CocktailModule {}
