import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ example: '댓글을 10자 이상 작성합니다.' })
  @IsString()
  @MinLength(10)
  @MaxLength(300)
  content: string;
}
