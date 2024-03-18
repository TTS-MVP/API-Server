import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class JWTDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
    description: '트니버스 액세스 토큰',
  })
  @IsString()
  accessToken: string;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
    description: '트니버스 리프레시 토큰',
  })
  refreshToken: string;
}

export class CheckTokenDTO extends OmitType(JWTDto, ['refreshToken']) {}
