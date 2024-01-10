import { UserProfileEntity } from '../entity/user-profile.entity';
import { JWTDto } from './jwt.dto';
import { ApiProperty } from '@nestjs/swagger';

export class isExistUserLoginDto extends JWTDto {
  @ApiProperty({
    example: true,
    description: '유저가 서비스에 가입되어 있는지 여부',
  })
  isExistUser: boolean;

  constructor(isExistUser: boolean, accessToken: string, refreshToken: string) {
    super();
    this.isExistUser = isExistUser;
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }
}

export class isNotExistUserLoginDto extends JWTDto {
  @ApiProperty({
    example: false,
    description: '유저가 서비스에 가입되어 있는지 여부',
  })
  isExistUser: boolean;

  @ApiProperty({
    description: '유저 프로필 정보',
    example: {
      id: 3261524388,
      nickName: '장동호',
      thumbnailUrl:
        'http://k.kakaocdn.net/dn/xY7RN/btsv7uJYMhj/8bWKP7mb2EelLW9JfevYc0/img_110x110.jpg',
    },
  })
  userProfileData: UserProfileEntity;
  constructor(isExistUser: boolean, accessToken: string, refreshToken: string) {
    super();
    this.isExistUser = isExistUser;
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }
}
