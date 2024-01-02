import { Controller, Get } from '@nestjs/common';
import { VoteService } from './vote.service';
import { ApiTags } from '@nestjs/swagger';
import { ApiGetMonthlyArtistVotes } from './decorator/swagger.decorator';

@ApiTags('투표')
@Controller('vote')
export class VoteController {
  constructor(private readonly voteService: VoteService) {}

  @ApiGetMonthlyArtistVotes()
  @Get('monthly-artist')
  getMonthlyArtistVotes() {
    return this.voteService.getMonthlyArtistVotes();
  }
}
