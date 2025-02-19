import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { UsersController } from './users.controller';
import { PassportModule } from '@nestjs/passport';
import { AuthnModule } from '../authn/authn.module';
import { AuthzModule } from '../authz/authz.module';
import { LocalStrategy } from '../local.strategy';
import { PassportService } from '../passport.service';

@Module({
  imports: [AuthnModule, AuthzModule, UserModule, PassportModule],
  controllers: [UsersController],
  providers: [PassportService, LocalStrategy],
})
export class UsersModule {}
