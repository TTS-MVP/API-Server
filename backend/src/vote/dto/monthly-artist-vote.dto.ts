import { ApiProperty } from '@nestjs/swagger';
import { ArtistDto } from 'src/artist/dto/artist.dto';

export class MonthlyArtistVoteDto extends ArtistDto {
  @ApiProperty({ example: 10, description: '아티스트의 투표 수' })
  voteCount: number;

  @ApiProperty({ example: 1, description: '아티스트의 랭킹' })
  rank: number;
}
