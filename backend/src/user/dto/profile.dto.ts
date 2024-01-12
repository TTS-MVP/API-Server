import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { ArtistDto } from 'src/artist/dto/artist.dto';

export class userProfileDto {
  @ApiProperty({ type: () => CreateUserDto })
  userProfile: CreateUserDto;

  @ApiProperty({ type: () => ArtistDto })
  favoriteArtistProfile: ArtistDto;

  @ApiProperty({ example: 23.5, description: '해당 월 유저 기여도(%)' })
  contribution: number;

  @ApiProperty({ example: 47, description: '유저 전체 순위' })
  rank: number;

  @ApiProperty({ example: 3, description: '유저 아티스트 순위' })
  artistRank: number;

  constructor() {
    this.userProfile = new CreateUserDto();
    this.favoriteArtistProfile = new ArtistDto();
  }
}
