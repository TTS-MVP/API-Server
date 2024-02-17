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
import { CommentEntity } from './community/entity/comment.entity';
import { VoteAcquisitionHistoryEntity } from './vote/entity/vote-acquisition-history.entity';
import { ArtistEntity } from './artist/entity/artist.entity';
import { ScheduleEntity } from './schedule/entity/schedule.entity';

const userSidebar = {
  name: '유저',
};
const voteSidebar = {
  name: '투표',
};
const communitySidebar = {
  name: '커뮤니티',
};
const scheduleSidebar = {
  name: '일정',
};

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
        useFactory: async () => {
          const { AdminJS } = await import('adminjs');
          const AdminJSTypeorm = await import('@adminjs/typeorm');
          AdminJS.registerAdapter({
            Resource: AdminJSTypeorm.Resource,
            Database: AdminJSTypeorm.Database,
          });
          return {
            adminJsOptions: {
              rootPath: '/api/admin',
              resources: [
                // 유저
                {
                  resource: UserInfoEntity,
                  options: {
                    parent: userSidebar,
                  },
                },
                {
                  resource: UserProfileEntity,
                  options: {
                    parent: userSidebar,
                  },
                },
                {
                  resource: ArtistEntity,
                  options: {
                    parent: userSidebar,
                  },
                },
                // 투표
                {
                  resource: VoteEntity,
                  options: {
                    parent: voteSidebar,
                  },
                },
                {
                  resource: VoteAcquisitionHistoryEntity,
                  options: {
                    parent: voteSidebar,
                  },
                },
                // 커뮤니티
                {
                  resource: FeedEntity,
                  options: {
                    parent: communitySidebar,
                    sort: {
                      sortBy: 'createdAt',
                      direction: 'desc',
                    },
                  },
                },
                {
                  resource: CommentEntity,
                  options: {
                    parent: communitySidebar,
                    sort: {
                      sortBy: 'createdAt',
                      direction: 'desc',
                    },
                  },
                },
                // 일정
                {
                  resource: ScheduleEntity,
                  options: {
                    parent: scheduleSidebar,
                  },
                },
              ],
            },
          };
        },
      }),
    ),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
