import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateFeedDto {
  @ApiProperty({ example: '아직 개발중임!!!!!' })
  @IsString()
  // class-validator로 string 500자가 안 넘어가는지 체크
  @MinLength(10)
  @MaxLength(500)
  content: string;

  // 안드로이드에서 retrofit으로 MultipartBody.Part로 데이터 전송됨
  @ApiProperty({ example: '' })
  @IsString()
  @IsOptional()
  thumbnailFile?: string;
}
