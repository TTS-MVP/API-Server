import { ApiProperty, OmitType } from '@nestjs/swagger';
import { ArtistDto } from 'src/artist/dto/artist.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

class UserProfileDto extends OmitType(CreateUserDto, [
  'favoriteArtistId',
] as const) {
  // UserProfileDto에 대한 추가적인 속성들...
}

export class FeedDto {
  @ApiProperty({ example: 1, description: '피드 고유 식별자' })
  id: number;

  @ApiProperty({ example: '글 내용입니다.' })
  content: string;

  @ApiProperty({
    required: false,
    default: null,
    nullable: true,
    example: 'https://example.com/thumbnail.jpg',
    description: '피드의 썸네일 URL',
  })
  thumbnailUrl?: string | null;

  @ApiProperty({ default: 0, description: '피드의 좋아요 수' })
  likeCount: number;

  @ApiProperty({ description: '피드 작성 시간' })
  createdAt: Date;

  @ApiProperty({ description: '피드 수정 시간' })
  updatedAt: Date;

  @ApiProperty({ type: UserProfileDto })
  userProfile: UserProfileDto;
}

export class FeedsDto {
  @ApiProperty({ type: ArtistDto })
  artistProfile: ArtistDto;

  @ApiProperty({ type: [FeedDto] })
  feeds: FeedDto[];
}
