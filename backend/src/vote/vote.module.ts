import { Module } from '@nestjs/common';
import { VoteService } from './vote.service';
import { VoteController } from './vote.controller';
import { VoteEntity } from './entity/vote.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MonthlyArtistVoteView } from './entity/monthly-artist-vote.view';
import { AuthModule } from 'src/auth/auth.module';
import { MonthlyFanVoteView } from './entity/monthly-fan-vote.view';
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      VoteEntity,
      MonthlyArtistVoteView,
      MonthlyFanVoteView,
    ]),
    AuthModule,
    UserModule,
  ],
  controllers: [VoteController],
  providers: [VoteService],
})
export class VoteModule {}
