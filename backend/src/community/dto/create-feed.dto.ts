import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateFeedDto {
  @ApiProperty({ example: '글을 작성합니다. 10글자 이상 작성합니다. 호호호' })
  @IsString()
  // class-validator로 string 500자가 안 넘어가는지 체크
  @MinLength(10)
  @MaxLength(500)
  content: string;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  @IsOptional()
  imageFile?: Express.Multer.File;
}
