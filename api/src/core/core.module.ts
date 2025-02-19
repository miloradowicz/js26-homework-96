import { Module } from '@nestjs/common';
import { AuthzService } from './authz/authz.service';
import { AuthnModule } from './authn/authn.module';
import { AuthzModule } from './authz/authz.module';
import { AuthnService } from './authn/authn.service';
import { UserModule } from './user/user.module';
import { UsersModule } from './users/users.module';
import { IsMongoDocumentRule } from './common/is-mongo-document/is-mongo-document.rule';

@Module({
  imports: [AuthnModule, AuthzModule, UserModule, UsersModule],
  providers: [AuthnService, AuthzService, IsMongoDocumentRule],
  exports: [AuthnService, AuthzService, IsMongoDocumentRule],
})
export class CoreModule {}
