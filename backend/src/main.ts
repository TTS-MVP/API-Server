import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { RequestMethod, ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { GlobalExceptionFilter } from './common/filter/filter.dto';

dotenv.config({
  path: path.resolve(
    process.env.NODE_ENV === 'stage' ? '.env.stage' : '.env.dev',
  ),
});

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // API 경로 설정
  app.setGlobalPrefix('api', {
    exclude: [{ path: 'admin', method: RequestMethod.GET }],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new GlobalExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('트니버스 API 명세서')
    .setDescription('트니버스 API 명세서입니다.')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        name: 'JWT',
        in: 'header',
      },
      'accessToken',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // authorization 헤더를 자동으로 추가해줍니다.
    },
  });

  await app.listen(3000);
}
bootstrap();
