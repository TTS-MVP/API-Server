import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class SocialLoginTypeDto {
  @ApiProperty({
    example: 0,
    description: '소셜 로그인 타입 0: 카카오, 1: 네이버',
  })
  @IsIn([0, 1])
  loginType: number;

  @ApiProperty({
    example: '토큰 값을 직접 넣어주세요.',
    description: '소셜 로그인 access token',
  })
  @IsString()
  @IsNotEmpty()
  accessToken: string;
}
