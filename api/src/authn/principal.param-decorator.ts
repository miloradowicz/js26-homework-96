import { createParamDecorator } from '@nestjs/common';
import { RequestWithPrincipal } from './authn.guard';

export const Principal = createParamDecorator((_, context) => {
  const request = context.switchToHttp().getRequest<RequestWithPrincipal>();

  return request.principal;
});
