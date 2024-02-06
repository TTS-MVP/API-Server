import { ApiProperty, OmitType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { ArtistDto } from 'src/artist/dto/artist.dto';
import { Exclude } from 'class-transformer';

export class ProfileDTO extends OmitType(CreateUserDto, ['favoriteArtistId']) {
  @ApiProperty({
    example: 102,
    description: '이번 달 투표 수',
  })
  voteCount: number;

  @ApiProperty({
    example: 364,
    description: '최애 아티스트 등록일로부터 경과한 일 수',
  })
  registedAt: number;

  @ApiProperty({ example: 23.5, description: '해당 월 유저 기여도(%)' })
  contribution: number;

  @ApiProperty({ example: 47, description: '유저 전체 순위' })
  rank: number;

  @ApiProperty({ example: 3, description: '유저 아티스트 순위' })
  artistRank: number;
}

export class UserProfileDTO {
  @ApiProperty({ type: () => ProfileDTO })
  userProfile: ProfileDTO;

  @ApiProperty({ type: () => ArtistDto })
  favoriteArtistProfile: ArtistDto;
}

export class SummaryProfileDTO extends OmitType(CreateUserDto, [
  'favoriteArtistId',
]) {
  @Exclude()
  registedAt: Date;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  @Exclude()
  favoriteArtistId: number;
}
