import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { VoteService } from './vote.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  ApiGetMonthlyArtistVotes,
  ApiGetMonthlyFanVotes,
  ApiVoteArtist,
} from './decorator/swagger.decorator';
import { GlobalException, ResponseDto } from 'src/common/dto/response.dto';
import { AuthGuard } from 'src/auth/auth-guard.service';
import { MonthlyArtistVoteView } from './entity/monthly-artist-vote.view';
import { MonthlyFanVoteDto } from './dto/monthly-fan-vote.dto';
import { VoteInfo, VoteResultDto } from './dto/vote.dto';

@ApiTags('투표')
@UseGuards(AuthGuard)
@ApiBearerAuth('accessToken')
@Controller('vote')
export class VoteController {
  constructor(private readonly voteService: VoteService) {}

  @ApiGetMonthlyArtistVotes()
  @Get('monthly-artist')
  async getMonthlyArtistVotes(): Promise<ResponseDto<MonthlyArtistVoteView[]>> {
    const votes = await this.voteService.getMonthlyArtistVotes();
    return new ResponseDto(
      true,
      200,
      '월간 아티스트 투표 순위 조회 성공',
      votes,
    );
  }

  // 월간 팬 투표 순위 조회
  /* 
    [Query]
    type: 0 - 전체, 1 - 팬
  */
  @ApiGetMonthlyFanVotes()
  @Get('monthly-fan')
  async getMonthlyFanVotes(
    @Query('type') type: number = 0,
    @Req() request,
  ): Promise<ResponseDto<MonthlyFanVoteDto[]>> {
    if (type >= 2) {
      throw new GlobalException(
        '타입은 0과 1만 사용할 수 있습니다. swagger 주석을 참고해주세요.',
        400,
      );
    }
    const userId = request['userInfo'].userId;
    const votes = await this.voteService.getMonthlyFanVotes(type, userId);
    return new ResponseDto(true, 200, '월간 팬 투표 순위 조회 성공', votes);
  }

  // 투표하기
  @ApiVoteArtist()
  @Post('artist')
  async voteArtist(
    @Body() voteInfo: VoteInfo,
    @Req() request,
  ): Promise<ResponseDto<VoteResultDto>> {
    const userId = request['userInfo'].userId;
    const { voteCount } = voteInfo;
    const result = await this.voteService.voteArtist(userId, Number(voteCount));
    return new ResponseDto(true, 200, '아티스트 투표 성공', result);
  }
}
