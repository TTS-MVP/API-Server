import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';
import { CommentDto } from './comment.dto';

export class CreateCommentDto {
  @ApiProperty({ example: '댓글을 10자 이상 작성합니다.' })
  @IsString()
  @MinLength(10)
  @MaxLength(300)
  content: string;
}

export class CreateCommentResponseDto {
  @ApiProperty({ description: '작성된 댓글의 수', example: '3' })
  commentCount?: number;

  @ApiProperty({
    description: '생성된 댓글',
    type: OmitType(CommentDto, ['userProfile']),
  })
  comment?: CommentDto;
}

export class DeleteCommentResponseDto extends OmitType(
  CreateCommentResponseDto,
  ['comment'],
) {}
