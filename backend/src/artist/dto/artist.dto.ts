import { ApiProperty } from '@nestjs/swagger';

export class ArtistDto {
  @ApiProperty({ example: 1, description: '아티스트의 고유 식별자' })
  id: number;

  @ApiProperty({ example: '박서진', description: '아티스트의 이름' })
  name: string;

  @ApiProperty({
    example: 'https://example.com/thumbnail.jpg',
    description: '아티스트의 썸네일 URL',
  })
  thumbnailUrl: string;
}
