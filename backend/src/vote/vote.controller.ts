import { Controller, Get } from '@nestjs/common';
import { VoteService } from './vote.service';
import { ApiTags } from '@nestjs/swagger';
import { ApiGetMonthlyArtistVotes } from './decorator/swagger.decorator';
import { ResponseDto } from 'src/common/dto/response.dto';

@ApiTags('투표')
@Controller('vote')
export class VoteController {
  constructor(private readonly voteService: VoteService) {}

  @ApiGetMonthlyArtistVotes()
  @Get('monthly-artist')
  async getMonthlyArtistVotes() {
    const votes = await this.voteService.getMonthlyArtistVotes();
    return new ResponseDto(
      true,
      200,
      '월간 아티스트 투표 순위 조회 성공',
      votes,
    );
  }
}
