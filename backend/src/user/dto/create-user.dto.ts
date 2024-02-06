import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsInt, IsString } from 'class-validator';

export class CreateUserDto {
  @Expose()
  @ApiProperty({
    example: 3261524388,
    description: '유저 고유 식별자',
  })
  @IsInt()
  id: number;

  @Expose()
  @ApiProperty({
    example: '장동호랑나비',
    description: '유저 닉네임',
  })
  @IsString()
  nickName: string;

  @Expose()
  @ApiProperty({
    example:
      'http://k.kakaocdn.net/dn/xY7RN/btsv7uJYMhj/8bWKP7mb2EelLW9JfevYc0/img_110x110.jpg',
    description: '유저 프로필 사진',
  })
  @IsString()
  thumbnailUrl: string;

  @Expose()
  @ApiProperty({
    example: 1,
    description: '최애 아티스트 고유 식별자',
  })
  @IsInt()
  favoriteArtistId: number;
}
