import { ApiProperty } from '@nestjs/swagger';

export class JWTDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
    description: '트니버스 액세스 토큰',
  })
  accessToken: string;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
    description: '트니버스 리프레시 토큰',
  })
  refreshToken: string;
}
