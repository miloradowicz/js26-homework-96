import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthnService } from './authn.service';
import { Request } from 'express';

export type RequestWithPrincipal = Request & { principal: string };

@Injectable()
export class AuthnGuard implements CanActivate {
  constructor(private readonly authenticationService: AuthnService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<RequestWithPrincipal>();
    const token = request.get('Authorization');

    if (!token) {
      return true;
    }

    const principal =
      await this.authenticationService.getPrincipalForToken(token);

    if (!principal) {
      throw new UnauthorizedException();
    }

    request.principal = principal;
    return true;
  }
}
