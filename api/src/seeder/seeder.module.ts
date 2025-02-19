import { Module } from '@nestjs/common';
import { DbModule } from 'src/db/db.module';
import { SeederService } from './seeder.service';
import { CoreModule } from 'src/core/core.module';

@Module({
  imports: [CoreModule, DbModule],
  providers: [SeederService],
})
export class SeederModule {}
