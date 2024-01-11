import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

// nickName은 name으로 속성 변경
export class MonthlyFanVoteDto extends OmitType(CreateUserDto, [
  'favoriteArtistId',
  'nickName',
]) {
  @ApiProperty({
    example: '장동호랑나비',
    description: '유저 닉네임',
  })
  @IsString()
  name: string;

  @ApiProperty({ example: 10, description: '아티스트의 투표 수' })
  voteCount: number;
}
