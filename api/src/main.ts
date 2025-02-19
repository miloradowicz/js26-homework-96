import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import config from 'src/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { CastErrorFilter } from './mongoose-errors/cast-error.filter';
import { ValidationErrorFilter } from './mongoose-errors/validation-error.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();
  app.useStaticAssets(join(config.rootPath, config.publicPath));
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new CastErrorFilter(), new ValidationErrorFilter());
  await app.listen(config.server.port);
}
bootstrap().catch(console.error);
