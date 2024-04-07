import { Injectable } from '@nestjs/common';
import { config } from 'dotenv';
import { resolve } from 'path';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

config({
  path: resolve(
    __dirname,
    process.env.NODE_ENV === 'stage' ? '.env.stage' : '.env.dev',
  ),
});

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: ['dist/**/*.entity{.ts,.js}', 'dist/**/*.view{.ts,.js}'],
      synchronize: false,
      charset: 'utf8mb4',
    };
  }
}

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: ['dist/**/*.entity{.ts,.js}', 'dist/**/*.view{.ts,.js}'],
  synchronize: false,
  migrations: ['dist/src/migration/*.js'],
  migrationsTableName: 'migration',
  migrationsRun: false,
  charset: 'utf8mb4',
});
