import { Module } from '@nestjs/common';
import { CocktailsService } from './cocktails.service';
import { CocktailsController } from './cocktails.controller';
import { CocktailModule } from 'src/cocktail/cocktail.module';
import { CoreModule } from 'src/core/core.module';

@Module({
  imports: [CoreModule, CocktailModule],
  controllers: [CocktailsController],
  providers: [CocktailsService],
})
export class CocktailsModule {}
