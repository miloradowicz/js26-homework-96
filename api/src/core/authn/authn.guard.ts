import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthnService } from './authn.service';
import { RequestWithPrincipal } from '../types';

@Injectable()
export class AuthnGuard implements CanActivate {
  constructor(private readonly authnService: AuthnService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<RequestWithPrincipal>();
    const token = request.get('Authorization');

    if (!token) {
      return true;
    }

    const principal = await this.authnService.getPrincipalForToken(token);

    if (!principal) {
      throw new UnauthorizedException();
    }

    request.principal = principal;
    return true;
  }
}
