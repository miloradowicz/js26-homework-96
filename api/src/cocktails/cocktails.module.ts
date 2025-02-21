import { Module } from '@nestjs/common';
import { CocktailsController } from './cocktails.controller';
import { CocktailModule } from 'src/cocktail/cocktail.module';
import { CoreModule } from 'src/core/core.module';

@Module({
  imports: [CoreModule, CocktailModule],
  controllers: [CocktailsController],
})
export class CocktailsModule {}
