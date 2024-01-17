import { ApiProperty, OmitType } from '@nestjs/swagger';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

class UserProfileDto extends OmitType(CreateUserDto, [
  'favoriteArtistId',
] as const) {
  // UserProfileDto에 대한 추가적인 속성들...
}

export class CommentDto {
  @ApiProperty({ example: 1, description: '댓글 고유 식별자' })
  id: number;

  @ApiProperty({ type: UserProfileDto, description: '댓글 작성자 정보' })
  userProfile?: UserProfileDto;

  @ApiProperty({ example: '댓글 내용입니다.' })
  content: string;

  @ApiProperty({ example: '2021-01-01 00:00:00' })
  createdAt?: Date;

  @ApiProperty({ example: '2021-01-01 00:00:00' })
  updatedAt?: Date;
}
