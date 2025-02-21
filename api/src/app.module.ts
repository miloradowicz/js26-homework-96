import { Module } from '@nestjs/common';
import { MongoModule } from './mongo/mongo.module';
import { SecretController } from './secret/secret.controller';
import { CocktailsController } from './cocktails/cocktails.controller';
import { CocktailsModule } from './cocktails/cocktails.module';
import { CoreModule } from './core/core.module';
import { CocktailModule } from './cocktail/cocktail.module';

@Module({
  imports: [MongoModule, CoreModule, CocktailModule, CocktailsModule],
  controllers: [SecretController, CocktailsController],
})
export class AppModule {}
