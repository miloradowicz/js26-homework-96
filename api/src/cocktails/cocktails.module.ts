import { Module } from '@nestjs/common';
import { CocktailsService } from './cocktails.service';
import { MongoModule } from 'src/mongo/mongo.module';
import { CocktailsController } from './cocktails.controller';

@Module({
  imports: [MongoModule],
  controllers: [CocktailsController],
  providers: [CocktailsService],
})
export class CocktailsModule {}
