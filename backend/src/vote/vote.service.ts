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
import { VoteEntity } from './entity/vote.entity';
import { VoteResultDto } from './dto/vote.dto';
import { ArtistService } from 'src/artist/artist.service';

@Injectable()
export class VoteService {
  constructor(
    @InjectRepository(MonthlyArtistVoteView)
    private monthlyArtistVoteRepository: Repository<MonthlyArtistVoteView>,
    @InjectRepository(MonthlyFanVoteView)
    private monthlyFanVoteRepository: Repository<MonthlyFanVoteView>,
    @InjectRepository(UserVoteCountView)
    private artistFanCountRepository: Repository<UserVoteCountView>,
    @InjectRepository(VoteEntity)
    private voteRepository: Repository<VoteEntity>,
    private artistService: ArtistService,
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

  async getUserVoteById(userId: number): Promise<number> {
    const vote = await this.artistFanCountRepository.findOne({
      select: ['voteCount'],
      where: { id: userId },
    });
    if (!vote)
      throw new GlobalException('유저의 투표 값을 불러올 수 없습니다.', 400);
    return Number(vote.voteCount);
  }

  async voteArtist(userId: number, voteCount: number): Promise<VoteResultDto> {
    // 유저 최애 아티스트 아이디 조회
    let userFavoriteArtistId = (
      await this.userService.getUserProfileByUserId(userId)
    ).favoriteArtistId;

    if (!userFavoriteArtistId) {
      throw new GlobalException(
        '최애 아티스트를 설정하지 않은 사용자입니다.',
        400,
      );
    }

    // 보유 투표권 개수 조회
    const remainVoteCount = await this.getUserVoteById(userId);
    if (remainVoteCount < voteCount) {
      throw new GlobalException(
        '보유한 투표권 개수보다 많은 투표를 시도했습니다.',
        400,
      );
    }

    // 아티스트 이름 조회
    const artistName = (
      await this.artistService.getArtistById(userFavoriteArtistId)
    ).name;
    if (!artistName) {
      throw new GlobalException('존재하지 않는 아티스트입니다.', 404);
    }

    // 투표하기
    try {
      this.voteRepository.save({
        artistId: userFavoriteArtistId,
        userId: userId,
        voteCount: voteCount,
      });
    } catch (error) {
      throw new GlobalException('투표에 실패했습니다.', 400);
    }

    // 기여도 계산
    const fanContribution = await this.getFanContribution(
      userId,
      userFavoriteArtistId,
    );

    // 결과 출력
    const result = {
      voteCount,
      remainVoteCount: remainVoteCount - voteCount,
      month: new Date().getMonth() + 1,
      artistName,
      rank: fanContribution,
    };

    return result;
  }

  async getUserRank(userId: number): Promise<number> {
    try {
      const userRank = await this.artistFanCountRepository
        .createQueryBuilder()
        .select(['a.id', 'a.voteCount'])
        .addSelect(
          '(@rank := IF(@last = a.voteCount, @rank, @rank + 1)) AS rank',
        )
        .addSelect('(@last := a.voteCount) AS last')
        .from(
          `(SELECT id, voteCount FROM monthly_fan_vote_view ORDER BY voteCount DESC)`,
          'a',
        )
        .from(`(SELECT @last := NULL, @rank := 0)`, 'b')
        .where('a.id = :userId', { userId })
        .getRawOne();

      if (!userRank) {
        throw new GlobalException('유저 랭킹을 불러올 수 없습니다.', 400);
      }

      return Number(userRank.rank);
    } catch (error) {
      // 로깅 또는 예외 처리 추가
      throw error;
    }
  }

  async getUserArtistRank(userId: number, artistId: number) {
    const userRank = await this.artistFanCountRepository
      .createQueryBuilder()
      .select(['a.id', 'a.voteCount'])
      .addSelect('(@rank := IF(@last = a.voteCount, @rank, @rank + 1)) AS rank')
      .addSelect('(@last := a.voteCount) AS last')
      .from(
        `(SELECT id, voteCount FROM monthly_fan_vote_view WHERE favoriteArtistId = :artistId ORDER BY voteCount DESC)`,
        'a',
      )
      .setParameter('artistId', artistId)
      .from(`(SELECT @last := NULL, @rank := 0)`, 'b')
      .where('a.id = :userId', { userId })
      .getRawOne();
    if (!userRank)
      throw new GlobalException('유저 랭킹을 불러올 수 없습니다.', 400);
    return Number(userRank.rank);
  }
}
