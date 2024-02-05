import { ApiProperty } from '@nestjs/swagger';
import { summaryFeedDto } from 'src/community/dto/get-feed.dto';
import { SummaryVideoDTO } from 'src/media/dto/media.dto';
import { MonthlyArtistSummaryDto } from 'src/vote/dto/vote.dto';

export class homeDTO {
  @ApiProperty({
    description: '투표',
    type: [MonthlyArtistSummaryDto],
  })
  votes: MonthlyArtistSummaryDto[];

  @ApiProperty({
    description: '일정',
    type: [String],
  })
  schedules: [];

  @ApiProperty({
    description:
      '24시간 기준 좋아요 수가 가장 많은 게시글 2개를 좋아요 많은 순으로 표시(사진, 텍스트 일부). 단, 사진 있는 게시글만 표시',
    type: [summaryFeedDto],
  })
  communities: summaryFeedDto[];

  @ApiProperty({
    description: '인기 순(조회 수 많은 순으로 5개)',
    type: [SummaryVideoDTO],
  })
  medias: SummaryVideoDTO[];
}
