import { ApiProperty } from '@nestjs/swagger';

export class ArtistDto {
  @ApiProperty({ example: 1, description: '아티스트의 고유 식별자' })
  id: number;

  @ApiProperty({ example: '박서진', description: '아티스트의 이름' })
  name: string;

  @ApiProperty({ example: 10, description: '아티스트에 대한 좋아요 수' })
  likesCount: number;

  @ApiProperty({ example: '', description: '아티스트의 썸네일 URL' })
  thumbnailUrl: string;

  constructor(
    id: number,
    name: string,
    likesCount: number,
    thumbnailUrl: string,
  ) {
    this.id = id;
    this.name = name;
    this.likesCount = likesCount;
    this.thumbnailUrl = thumbnailUrl;
  }
}
