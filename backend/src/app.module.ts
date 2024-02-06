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
import { HomeModule } from './home/home.module';
import { VoteEntity } from './vote/entity/vote.entity';
import { FeedEntity } from './community/entity/feed.entity';
import { UserProfileEntity } from './user/entity/user-profile.entity';
import { UserInfoEntity } from './user/entity/user-info.entity';

// 동적으로 import
import('adminjs')
  .then((AdminJS) => {
    // adminjs/typeorm도 동적으로 import
    import('@adminjs/typeorm')
      .then((AdminJSTypeorm) => {
        AdminJS.default.registerAdapter({
          Resource: AdminJSTypeorm.Resource,
          Database: AdminJSTypeorm.Database,
        });
      })
      .catch((error) => {
        console.error('Failed to import @adminjs/typeorm:', error);
      });
  })
  .catch((error) => {
    console.error('Failed to import adminjs:', error);
  });

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
    HomeModule,
    UserModule,
    ArtistModule,
    VoteModule,
    CommunityModule,
    StorageModule,
    ScheduleModule,
    MediaModule,
    import('@adminjs/nestjs').then(({ AdminModule }) =>
      AdminModule.createAdminAsync({
        useFactory: () => ({
          adminJsOptions: {
            rootPath: '/api/admin',
            resources: [
              VoteEntity,
              FeedEntity,
              UserProfileEntity,
              UserInfoEntity,
            ],
          },
        }),
      }),
    ),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
