import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MonthlyArtistVoteView } from './entity/monthly-artist-vote.view';

@Injectable()
export class VoteService {
  constructor(
    @InjectRepository(MonthlyArtistVoteView)
    private monthlyArtistVoteRepository: Repository<MonthlyArtistVoteView>,
  ) {}
  async getMonthlyArtistVotes(): Promise<MonthlyArtistVoteView[]> {
    // voteCount 순으로 내림차순 정렬, 같을 시 name 오름차순 정렬
    const ArtistVotes = await this.monthlyArtistVoteRepository.find();

    return ArtistVotes.map((item) => ({
      ...item,
      voteCount: Number(item.voteCount),
    }));
  }
}
