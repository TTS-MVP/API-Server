import { Module, forwardRef } from '@nestjs/common';
import { VoteService } from './vote.service';
import { VoteController } from './vote.controller';
import { VoteEntity } from './entity/vote.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MonthlyArtistVoteView } from './entity/monthly-artist-vote.view';
import { AuthModule } from 'src/auth/auth.module';
import { MonthlyFanVoteView } from './entity/monthly-fan-vote.view';
import { UserModule } from 'src/user/user.module';
import { VoteAcquisitionHistoryEntity } from './entity/vote-acquisition-history.entity';
import { UserVoteCountView } from './entity/vote-count.view';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      VoteEntity,
      MonthlyArtistVoteView,
      MonthlyFanVoteView,
      VoteAcquisitionHistoryEntity,
      UserVoteCountView,
    ]),
    AuthModule,
    forwardRef(() => UserModule),
  ],
  controllers: [VoteController],
  providers: [VoteService],
  exports: [VoteService],
})
export class VoteModule {}
