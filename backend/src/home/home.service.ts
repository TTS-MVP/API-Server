import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CommunityService } from 'src/community/community.service';
import { SummaryVideoDTO } from 'src/media/dto/media.dto';
import { MediaService } from 'src/media/media.service';
import { VoteService } from 'src/vote/vote.service';

@Injectable()
export class HomeService {
  constructor(
    private readonly voteService: VoteService,
    private readonly communityService: CommunityService,
    private readonly mediaService: MediaService,
  ) {}
  async getHome(userId: number) {
    const medias = await this.mediaService.getMedia(userId, 'viewCount', 5);
    const result = {
      votes: await this.voteService.getMonthlyArtistVotesSummary(userId),
      schedules: [],
      communities: await this.communityService.getHotFeeds(),
      medias: medias.map((media) => plainToInstance(SummaryVideoDTO, media)),
    };
    return result;
  }
}
