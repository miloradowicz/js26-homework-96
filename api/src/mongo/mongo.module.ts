import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import config from 'src/config';
import { Cocktail, CocktailSchema } from 'src/schemas/cocktail.schema';

@Module({
  imports: [
    MongooseModule.forRoot(new URL(config.mongo.db, config.mongo.host).href),
    MongooseModule.forFeature([
      { name: Cocktail.name, schema: CocktailSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class MongoModule {}
