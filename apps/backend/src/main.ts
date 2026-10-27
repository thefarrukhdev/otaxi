import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // 1. CORS enabled
  const corsOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',').map((origin) => origin.trim())
    : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'];

  app.enableCors({
    origin: corsOrigins.length > 0 ? corsOrigins : true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'x-idempotency-key'],
  });

  // 2. Global API prefix
  const apiPrefix = process.env.API_PREFIX?.replace(/^\//, '') || 'api/v1';
  app.setGlobalPrefix(apiPrefix, {
    exclude: ['docs', 'docs-json', 'health'],
  });

  // 3. ValidationPipe ({ whitelist: true, transform: true, forbidNonWhitelisted: true })
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // 4. Global HTTP Exception Filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // 5. Global Transform Interceptor
  app.useGlobalInterceptors(new TransformInterceptor());

  // 6. Swagger OpenAPI documentation at /docs (with JWT Bearer)
  const config = new DocumentBuilder()
    .setTitle('OTAXI API')
    .setDescription(
      'OTAXI — Central Asia Intercity & Cross-Border Ridesharing Platform Backend API Documentation. Supports Passenger, Driver, and Admin CRM/ERP operations.',
    )
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Bearer JWT tokenni kiriting',
        in: 'header',
      },
      'bearer',
    )
    .addTag('Auth', 'SMS OTP autentifikatsiya, JWT access va refresh tokenlar')
    .addTag('Users', 'Foydalanuvchi profili va til sozlamalari')
    .addTag('Drivers', 'Haydovchi profili, verifikatsiya moderatsiyasi va daromadlar')
    .addTag('Vehicles', 'Haydovchi avtomobillari boshqaruvi')
    .addTag('Trips', 'Reyslar qidiruvi, yaratish va status mashinasi')
    .addTag('Bookings', 'Concurrency-safe joy bron qilish, to`lov muddati va tasdiqlash')
    .addTag('Payments', 'To`lov sessiyasi va idempotent webhooklar (Payme, Click, Uzum)')
    .addTag('Wallet', 'Haydovchi balansi, tranzaksiyalar jurnali va pul yechish (Payout)')
    .addTag('Border Checklists', 'Xalqaro reyslar uchun chegara talablari va chek-listlar')
    .addTag('Admin', 'Admin KPI statistikasi, haydovchilarni tasdiqlash va audit loglar')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    customSiteTitle: 'OTAXI API Documentation',
    swaggerOptions: {
      persistAuthorization: true,
      filter: true,
    },
  });

  const port = process.env.PORT || 4000;
  await app.listen(port);

  logger.log(`=======================================================`);
  logger.log(`🚀 OTAXI Backend running on: http://localhost:${port}/${apiPrefix}`);
  logger.log(`📚 Swagger documentation at: http://localhost:${port}/docs`);
  logger.log(`=======================================================`);
}

bootstrap();
