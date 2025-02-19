import { Module } from '@nestjs/common';
import { DbModule } from './db/db.module';
import { SecretController } from './secret/secret.controller';
import { CocktailsController } from './cocktails/cocktails.controller';
import { CocktailsService } from './cocktails/cocktails.service';
import { CocktailsModule } from './cocktails/cocktails.module';

import { CoreModule } from './core/core.module';

@Module({
  imports: [CoreModule, DbModule, CocktailsModule],
  controllers: [SecretController, CocktailsController],
  providers: [CocktailsService],
})
export class AppModule {}
