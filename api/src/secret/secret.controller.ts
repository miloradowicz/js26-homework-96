import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthnGuard } from 'src/authn/authn.guard';
import { AuthzGuard } from 'src/authz/authz.guard';
import { Roles } from 'src/authz/roles.decorator';

@Controller('secret')
export class SecretController {
  @Roles('admin')
  @UseGuards(AuthnGuard, AuthzGuard)
  @Get()
  getSecret() {
    return 'secret';
  }
}
