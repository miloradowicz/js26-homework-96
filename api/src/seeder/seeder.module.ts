import { Module } from '@nestjs/common';
import { MongoModule } from 'src/mongo/mongo.module';
import { SeederService } from './seeder.service';
import { CoreModule } from 'src/core/core.module';
import { CocktailModule } from 'src/cocktail/cocktail.module';

@Module({
  imports: [MongoModule, CoreModule, CocktailModule],
  providers: [SeederService],
})
export class SeederModule {}
