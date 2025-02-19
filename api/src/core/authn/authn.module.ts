import { Module } from '@nestjs/common';
import { AuthnService } from './authn.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  providers: [AuthnService],
  exports: [AuthnService],
})
export class AuthnModule {}
