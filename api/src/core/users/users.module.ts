import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { UsersController } from './users.controller';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from '../local.strategy';
import { PassportService } from '../passport.service';
import { AuthnService } from '../authn/authn.service';
import { AuthzService } from '../authz/authz.service';

@Module({
  imports: [UserModule, PassportModule],
  controllers: [UsersController],
  providers: [AuthnService, AuthzService, PassportService, LocalStrategy],
})
export class UsersModule {}
