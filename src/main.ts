// main.ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);


  // Validación de los datos de entrada
  app.useGlobalPipes(new ValidationPipe());

  app.use(cors({
    origin: process.env.FRONTEND_URL, // frontend Next.js
    credentials: true, // ⬅️ necesario para permitir cookies
  }));

  // Configuración de cookies
  app.use(cookieParser());

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
  SwaggerModule.setup('api', app, document); 
  }

    // Esto expone la carpeta 'uploads' en la raíz del proyecto
    
    app.useStaticAssets(join(__dirname, '..', '..', '..', 'uploads'), {
      prefix: '/uploads/',
    });


  // Inicio del servidor
  await app.listen(process.env.PORT || 3000);

  console.log(`Server is running on port ${process.env.PORT || 3000}`);
}
bootstrap();
