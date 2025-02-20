import { Module } from '@nestjs/common';
import { MongoModule } from './mongo/mongo.module';
import { SecretController } from './secret/secret.controller';
import { CocktailsController } from './cocktails/cocktails.controller';
import { CocktailsService } from './cocktails/cocktails.service';
import { CocktailsModule } from './cocktails/cocktails.module';

import { CoreModule } from './core/core.module';

@Module({
  imports: [CoreModule, MongoModule, CocktailsModule],
  controllers: [SecretController, CocktailsController],
  providers: [CocktailsService],
})
export class AppModule {}
