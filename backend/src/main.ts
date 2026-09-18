import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import dns from 'node:dns';
import { ValidationPipe } from '@nestjs/common';

dns.setServers(['8.8.8.8', '1.1.1.1']);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
