import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import dns from 'node:dns';

dns.setServers(['8.8.8.8', '1.1.1.1']);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
