import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MonthlyArtistVoteView } from './entity/monthly-artist-vote.view';
import { MonthlyFanVoteView } from './entity/monthly-fan-vote.view';
import { UserService } from 'src/user/user.service';
import { GlobalException } from 'src/common/dto/response.dto';
import { MonthlyFanVoteDto } from './dto/monthly-fan-vote.dto';
import { MonthlyArtistVoteDto } from './dto/monthly-artist-vote.dto';
import { UserVoteCountView } from './entity/vote-count.view';

@Injectable()
export class VoteService {
  constructor(
    @InjectRepository(MonthlyArtistVoteView)
    private monthlyArtistVoteRepository: Repository<MonthlyArtistVoteView>,
    @InjectRepository(MonthlyFanVoteView)
    private monthlyFanVoteRepository: Repository<MonthlyFanVoteView>,
    @InjectRepository(UserVoteCountView)
    private artistFanCountRepository: Repository<UserVoteCountView>,
    private userService: UserService,
  ) {}
  async getMonthlyArtistVotes(): Promise<MonthlyArtistVoteDto[]> {
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
  ): Promise<MonthlyFanVoteDto[]> {
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
    return fanVotes.map((item) => {
      const { favoriteArtistId, ...rest } = item;
      return {
        ...rest,
        voteCount: Number(item.voteCount),
      };
    });
  }

  async getFanContribution(fanId: number, artistId: number): Promise<number> {
    const [fanVotes, artistVotes] = await Promise.all([
      this.monthlyFanVoteRepository.find({
        select: ['voteCount'],
        where: { id: fanId },
      }),
      this.monthlyArtistVoteRepository.find({
        select: ['voteCount'],
        where: { id: artistId },
      }),
    ]);
    const fanVoteCount = Number(fanVotes[0].voteCount);
    const artistVoteCount = Number(artistVotes[0].voteCount);
    if (fanVoteCount === undefined || !artistVoteCount === undefined)
      throw new GlobalException('투표 값에 문제가 발생했습니다.', 400);
    if (fanVoteCount > artistVoteCount) return 100;

    const contribution = 100 - (fanVoteCount / artistVoteCount) * 100;
    return contribution;
  }

  async getUserVotById(userId: number): Promise<number> {
    const vote = await this.artistFanCountRepository.findOne({
      select: ['voteCount'],
      where: { id: userId },
    });
    if (!vote)
      throw new GlobalException('유저의 투표 값을 불러올 수 없습니다.', 400);
    return Number(vote.voteCount);
  }
}
