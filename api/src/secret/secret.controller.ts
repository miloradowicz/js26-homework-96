import { Controller, Get } from '@nestjs/common';
import { Auth } from 'src/core/common/auth/auth.decorator';

@Controller('secret')
export class SecretController {
  @Auth()
  @Get()
  getSecret() {
    return 'secret';
  }
}
