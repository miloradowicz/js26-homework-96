import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import config from 'src/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { CastErrorFilter } from './exception-filters/cast-error.filter';
import { ValidationErrorFilter } from './exception-filters/validation-error.filter';
import { useContainer, ValidationError } from 'class-validator';
import {
  DtoValidationError,
  DtoValidationErrorFilter,
} from './exception-filters/dto-validation-error.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.enableCors();
  app.useStaticAssets(join(config.rootPath, config.publicPath));
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (validationErrors: ValidationError[]) => {
        throw new DtoValidationError(validationErrors);
      },
    }),
  );
  app.useGlobalFilters(
    new CastErrorFilter(),
    new ValidationErrorFilter(),
    new DtoValidationErrorFilter(),
  );
  await app.listen(config.server.port);
}
bootstrap().catch(console.error);
