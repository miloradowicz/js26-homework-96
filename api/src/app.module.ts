import { Module } from '@nestjs/common';
import { AuthnModule } from './authn/authn.module';
import { DbModule } from './db/db.module';
import { SecretController } from './secret/secret.controller';

@Module({
  imports: [AuthnModule, DbModule],
  controllers: [SecretController],
})
export class AppModule {}
