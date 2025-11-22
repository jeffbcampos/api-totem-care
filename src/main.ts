import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configurar CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  
  // Configurar pipe de validação global com class-validator
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  
  // Configurar serialização de responses com class-transformer
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector), {
      strategy: 'exposeAll',
      excludeExtraneousValues: false,
    }),
  );
  
  // Configurar filtros de exceção globais
  app.useGlobalFilters(
    new HttpExceptionFilter(),
    new PrismaExceptionFilter(),
  );
  
  // Configurar Swagger
  const config = new DocumentBuilder()
    .setTitle('Totem Care API')
    .setDescription('Sistema de gerenciamento de atendimento de emergência baseado no Protocolo de Manchester')
    .setVersion('1.0')
    .addTag('health', 'Health checks e status da aplicação')
    .addTag('pacientes', 'Operações relacionadas a pacientes')
    .addTag('atendimentos', 'Operações relacionadas a atendimentos')
    .addTag('sintomas', 'Operações relacionadas a sintomas para triagem')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  // Configuração de porta e ambiente
  const port = process.env.PORT || 3000;
  const environment = process.env.NODE_ENV || 'development';
  
  await app.listen(port);
  
  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📚 Swagger documentation: http://localhost:${port}/api`);
  console.log(`📦 Environment: ${environment}`);
}
bootstrap();
