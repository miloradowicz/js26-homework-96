import { Module } from '@nestjs/common';
import { AuthnModule } from '../authn/authn.module';
import { AuthzService } from './authz.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [AuthnModule, UserModule],
  providers: [AuthzService],
  exports: [AuthzService],
})
export class AuthzModule {}
