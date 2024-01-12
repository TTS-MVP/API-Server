import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsInt, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 3261524388,
    description: '유저 고유 식별자',
  })
  @IsInt()
  id: number;

  @ApiProperty({
    example: '장동호랑나비',
    description: '유저 닉네임',
  })
  @IsString()
  nickName: string;

  @ApiProperty({
    example:
      'http://k.kakaocdn.net/dn/xY7RN/btsv7uJYMhj/8bWKP7mb2EelLW9JfevYc0/img_110x110.jpg',
    description: '유저 프로필 사진',
  })
  @IsString()
  thumbnailUrl: string;

  @ApiProperty({
    example: 1,
    description: '최애 아티스트 고유 식별자',
  })
  @IsInt()
  favoriteArtistId: number;

  @ApiProperty({
    example: '13',
    description: '최애 아티스트 등록일로부터 경과한 일 수',
  })
  @IsInt()
  favoriteArtistRegisteredDay?: number;
}
