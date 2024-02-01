import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ArtistModule } from './artist/artist.module';
import { VoteModule } from './vote/vote.module';
import { TypeOrmConfigService } from 'typeorm.config';
import { UserModule } from './user/user.module';
import { CommunityModule } from './community/community.module';
import { StorageModule } from './storage/storage.module';
import { ScheduleModule } from './schedule/schedule.module';
import { MediaModule } from './media/media.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV === 'stage' ? '.env.stage' : '.env.dev',
      isGlobal: true,
      cache: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeOrmConfigService,
    }),
    ArtistModule,
    VoteModule,
    UserModule,
    CommunityModule,
    StorageModule,
    ScheduleModule,
    MediaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
