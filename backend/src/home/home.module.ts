import { Module } from '@nestjs/common';
import { HomeService } from './home.service';
import { HomeController } from './home.controller';
import { AuthModule } from 'src/auth/auth.module';
import { VoteModule } from 'src/vote/vote.module';
import { ScheduleModule } from 'src/schedule/schedule.module';
import { CommunityModule } from 'src/community/community.module';
import { MediaModule } from 'src/media/media.module';

@Module({
  imports: [
    AuthModule,
    VoteModule,
    ScheduleModule,
    CommunityModule,
    MediaModule,
  ],
  controllers: [HomeController],
  providers: [HomeService],
})
export class HomeModule {}
