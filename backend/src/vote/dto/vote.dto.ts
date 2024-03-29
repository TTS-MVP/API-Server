import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class VoteInfo {
  @ApiProperty({
    example: 3,
    description: '투표권 사용(지급) 개수',
  })
  @IsInt()
  voteCount: number;
}

export class GiveVoteInfo extends VoteInfo {
  @ApiProperty({
    example: 1,
    description:
      '투표권 지급 타입(0: 투표하기, 1: 출석체크, 2: 최애 일정 확인, 3: 커뮤니티 댓글 쓰기, 4: 커뮤니티 글쓰기)',
  })
  @IsInt()
  type: number;
}

export class VoteResultDto {
  @ApiProperty({
    example: true,
    description: '일일 미션 클리어 여부',
  })
  isClearMission: boolean;

  @ApiProperty({
    example: 1,
    description: '투표권 사용 개수',
  })
  @IsInt()
  voteCount: number;

  // 남은 투표권 개수
  @ApiProperty({
    example: 20,
    description: '남은 투표권 개수',
  })
  @IsInt()
  remainVoteCount: number;

  // 해당 월
  @ApiProperty({
    example: 3,
    description: '해당 월',
  })
  @IsInt()
  month: number;

  // 아티스트 이름
  @ApiProperty({
    example: '임영웅',
    description: '아티스트 이름',
  })
  @IsString()
  artistName: string;

  // 상위 몇 %인지
  @ApiProperty({
    example: 10,
    description: '상위 몇 %인지',
  })
  @IsInt()
  rank: number;
}

export class MonthlyArtistSummaryDto {
  @ApiProperty({
    example: 1,
    description: '아티스트 랭킹',
  })
  rank: number;

  @ApiProperty({
    example: 1,
    description: '아티스트 아이디',
  })
  id: number;

  @ApiProperty({
    example: '박서진',
    description: '아티스트 이름',
  })
  name: string;

  @ApiProperty({
    example:
      'https://storage.googleapis.com/tniverse-seoul-dev-storage-01/artist/%EB%B0%95%EC%84%9C%EC%A7%84.jpg',
    description: '아티스트 썸네일 URL',
  })
  thumbnailUrl: string;

  @ApiProperty({
    example: 55,
    description: '투표 수',
  })
  voteCount: number;

  @ApiProperty({
    example: true,
    description: '최애 아티스트 여부',
  })
  isFavorite: boolean;
}
