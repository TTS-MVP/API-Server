import { Module } from '@nestjs/common';
import { VoteService } from './vote.service';
import { VoteController } from './vote.controller';
import { VoteEntity } from './entity/vote.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MonthlyArtistVoteView } from './entity/monthly-artist-vote.view';

@Module({
  imports: [TypeOrmModule.forFeature([VoteEntity, MonthlyArtistVoteView])],
  controllers: [VoteController],
  providers: [VoteService],
})
export class VoteModule {}
