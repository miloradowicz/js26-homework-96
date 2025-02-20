import { Module } from '@nestjs/common';
import { MongoModule } from 'src/mongo/mongo.module';
import { SeederService } from './seeder.service';
import { CoreModule } from 'src/core/core.module';

@Module({
  imports: [CoreModule, MongoModule],
  providers: [SeederService],
})
export class SeederModule {}
