import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { SummaryProfileDTO } from 'src/user/dto/profile.dto';

export class CommentDto {
  @Expose()
  @ApiProperty({ example: 1, description: '댓글 고유 식별자' })
  id: number;

  @Expose()
  @ApiProperty({ type: SummaryProfileDTO, description: '댓글 작성자 정보' })
  userProfile?: SummaryProfileDTO;

  @Expose()
  @ApiProperty({ example: '댓글 내용입니다.' })
  content: string;

  @Expose()
  @ApiProperty({ example: '2021-01-01 00:00:00' })
  createdAt?: Date;

  @Expose()
  @ApiProperty({ example: '2021-01-01 00:00:00' })
  updatedAt?: Date;

  @Exclude()
  userId: number;

  @Exclude()
  feedId: number;

  @Exclude()
  status: number;
}
