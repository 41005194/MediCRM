import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://localhost:3000', 'https://medi-crm.vercel.app'], // on ajoutera le Vercel plus tard
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  await app.listen(3001); // backend sur le port 3001
  console.log('🚀 Backend MediCRM running on http://localhost:3001');
}
bootstrap();