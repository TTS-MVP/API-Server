import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { RequestMethod } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as path from 'path';

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

  const config = new DocumentBuilder()
    .setTitle('트니버스 API 명세서')
    .setDescription('트니버스 API 명세서입니다.')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/docs', app, document);

  await app.listen(3000);
}
bootstrap();
