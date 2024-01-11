import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MonthlyArtistVoteView } from './entity/monthly-artist-vote.view';
import { MonthlyFanVoteView } from './entity/monthly-fan-vote.view';
import { UserService } from 'src/user/user.service';
import { GlobalException } from 'src/common/dto/response.dto';

@Injectable()
export class VoteService {
  constructor(
    @InjectRepository(MonthlyArtistVoteView)
    private monthlyArtistVoteRepository: Repository<MonthlyArtistVoteView>,
    @InjectRepository(MonthlyFanVoteView)
    private monthlyFanVoteRepository: Repository<MonthlyFanVoteView>,
    private userService: UserService,
  ) {}
  async getMonthlyArtistVotes(): Promise<MonthlyArtistVoteView[]> {
    // voteCount 순으로 내림차순 정렬, 같을 시 name 오름차순 정렬
    const ArtistVotes = await this.monthlyArtistVoteRepository.find();

    return ArtistVotes.map((item) => ({
      ...item,
      voteCount: Number(item.voteCount),
    }));
  }

  async getMonthlyFanVotes(
    type: number,
    userId: number,
  ): Promise<MonthlyFanVoteView[]> {
    let options;
    if (type === 1) {
      const userFavoriteArtistId = (
        await this.userService.getUserProfileByUserId(userId)
      ).favoriteArtistId;
      if (!userFavoriteArtistId) {
        throw new GlobalException('최애 아티스트를 설정해주세요.', 400);
      }
      options = {
        where: {
          favoriteArtistId: userFavoriteArtistId,
        },
      };
    }

    const fanVotes = await this.monthlyFanVoteRepository.find(options);
    return fanVotes.map((item) => ({
      ...item,
      voteCount: Number(item.voteCount),
    }));
  }
}
