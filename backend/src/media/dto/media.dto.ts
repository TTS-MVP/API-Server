import { ApiProperty } from '@nestjs/swagger';

export class VideoItemDTO {
  @ApiProperty({
    example: '임영웅 - 이제 나만 믿어요',
    description: '영상 제목',
  })
  title: string;

  @ApiProperty({
    example: 'https://i.ytimg.com/vi/KZMAvB1unQs/sddefault.jpg',
    description: '영상 썸네일 이미지 URL',
  })
  thumbnailUrl: string;

  @ApiProperty({
    example: '2023-12-23T01:32:56Z',
    description: '영상 게시 날짜',
  })
  publishedAt: Date;

  @ApiProperty({
    example: 'https://www.youtube.com/watch?v=KZMAvB1unQs',
    description: '영상 URL',
  })
  url: string;

  @ApiProperty({
    example: 0,
    description: '영상 조회수',
  })
  views: number;
}
