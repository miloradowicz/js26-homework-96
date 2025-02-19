import { Module } from '@nestjs/common';
import { CocktailsService } from './cocktails.service';
import { DbModule } from 'src/db/db.module';
import { CocktailsController } from './cocktails.controller';

@Module({
  imports: [DbModule],
  controllers: [CocktailsController],
  providers: [CocktailsService],
})
export class CocktailsModule {}
