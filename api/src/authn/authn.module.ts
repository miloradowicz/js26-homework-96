import { Module } from '@nestjs/common';
import { AuthnService } from './authn.service';
import { DbModule } from 'src/db/db.module';

@Module({
  imports: [DbModule],
  providers: [AuthnService],
  exports: [AuthnService],
})
export class AuthnModule {}
