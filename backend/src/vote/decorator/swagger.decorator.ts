import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MonthlyArtistVoteDto } from '../dto/monthly-artist-vote.dto';

export const ApiGetMonthlyArtistVotes = () => {
  return (target: any, key: string, descriptor: PropertyDescriptor) => {
    ApiOperation({
      summary: '월간 아티스트 투표 순위 조회',
      description: '월간 아티스트 투표 순위를 가져온다.',
    })(target, key, descriptor);

    ApiResponse({
      status: 200,
      description: '성공적으로 월간 아티스트 투표 순위를 가져왔을 때의 응답',
      type: [MonthlyArtistVoteDto],
    })(target, key, descriptor);

    ApiResponse({
      status: 500,
      description: '서버 오류 발생 시의 응답',
    })(target, key, descriptor);
  };
};
