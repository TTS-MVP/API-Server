import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class VoteInfo {
  @ApiProperty({
    example: 3,
    description: '투표권 사용 개수',
  })
  @IsInt()
  voteCount: number;
}

export class VoteResultDto {
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
