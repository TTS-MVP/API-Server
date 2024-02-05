import { ApiProperty, OmitType } from '@nestjs/swagger';
import { ArtistDto } from 'src/artist/dto/artist.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { CommentDto } from './comment.dto';
import { Exclude, Expose } from 'class-transformer';

class UserProfileDto extends OmitType(CreateUserDto, [
  'favoriteArtistId',
] as const) {
  // UserProfileDto에 대한 추가적인 속성들...
}

export class FeedDto {
  @Expose()
  @ApiProperty({ example: 1, description: '피드 고유 식별자' })
  id: number;

  @Expose()
  @ApiProperty({ example: '글 내용입니다.' })
  content: string;

  @Expose()
  @ApiProperty({
    required: false,
    default: null,
    nullable: true,
    example: 'https://example.com/thumbnail.jpg',
    description: '피드의 썸네일 URL',
  })
  thumbnailUrl?: string | null;

  @Expose()
  @ApiProperty({ default: 0, description: '피드의 좋아요 수' })
  likeCount?: number;

  @Expose()
  @ApiProperty({ description: '피드 작성 시간' })
  createdAt?: Date;

  @Expose()
  @ApiProperty({ description: '피드 수정 시간' })
  updatedAt?: Date;

  @Expose()
  @ApiProperty({ type: UserProfileDto })
  userProfile?: UserProfileDto;

  @Exclude()
  userId?: number;

  @Exclude()
  status?: number;

  @Exclude()
  favoriteArtistId?: number;
}

export class summaryFeedDto extends OmitType(FeedDto, [
  'likeCount',
  'createdAt',
  'updatedAt',
  'userProfile',
] as const) {
  @Exclude()
  likeCount?: number;

  @Exclude()
  createdAt?: Date;

  @Exclude()
  updatedAt?: Date;

  @Exclude()
  userProfile?: UserProfileDto;
}

export class FeedsDto {
  @ApiProperty({ type: ArtistDto })
  artistProfile: ArtistDto;

  @ApiProperty({ type: [FeedDto] })
  feeds: FeedDto[];
}

export class DetailFeedDto extends FeedDto {
  @ApiProperty({ type: [CommentDto] })
  comments: CommentDto[];
}
