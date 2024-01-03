import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: this.configService.get<string>('DB_HOST'),
      port: +this.configService.get<number>('DB_PORT'),
      username: this.configService.get<string>('DB_USERNAME'),
      password: this.configService.get<string>('DB_PASSWORD'),
      database: this.configService.get<string>('DB_DATABASE'),
      entities: ['dist/**/*.entity{.ts,.js}', 'dist/**/*.view{.ts,.js}'],
      synchronize:
        this.configService.get<string>('DB_SYNCHRONIZE') === 'true'
          ? true
          : false,
      // 마이그레이션
      migrations: ['dist/src/migration/*.js'],
      migrationsTableName: 'migration',
      migrationsRun: false,
    };
  }
}
