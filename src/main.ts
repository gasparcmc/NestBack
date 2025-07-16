// main.ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validación de los datos de entrada
  app.useGlobalPipes(new ValidationPipe());

  app.use(cors({
    origin: process.env.FRONTEND_URL, // frontend Next.js
    credentials: true, // ⬅️ necesario para permitir cookies
  }));

  // Configuración de cookies
  app.use(cookieParser());
  // Configuración de CORS
  //app.enableCors({
  //  origin: 'http://localhost:3000', // frontend Next.js
  //  credentials: true, // ⬅️ necesario para permitir cookies
  //});

  if (process.env.NODE_ENV === 'test') {
  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('Mi API')
    .setDescription('Documentación de la API')
    .setVersion('1.0')
    .addBearerAuth() // Si usás JWT, esto agrega el input de token
    .build();

  // Creación del documento de Swagger
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // http://localhost:3000/api
  }

  // Inicio del servidor
  await app.listen(3000);
}
bootstrap();
