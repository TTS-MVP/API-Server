import { ApiOperation, ApiProperty, ApiResponse } from '@nestjs/swagger';
import { MonthlyArtistVoteDto } from '../dto/monthly-artist-vote.dto';
import { MonthlyFanVoteDto } from '../dto/monthly-fan-vote.dto';
import { VoteResultDto } from '../dto/vote.dto';

export const ApiGetMonthlyFanVotes = () => {
  return (target: any, key: string, descriptor: PropertyDescriptor) => {
    ApiOperation({
      summary: '월간 팬 투표 순위 조회',
      description: `
      월간 팬 투표 순위를 가져온다.  

      파라미터 설명:
      >> type 0은 전체 아티스트들을 대상으로 한 팬 투표 순위를 가져온다.
      >> type 1은 사용자의 최애 아티스트를 대상으로 한 팬 투표 순위를 가져온다.
      `,
    })(target, key, descriptor);

    ApiResponse({
      status: 200,
      description: '성공적으로 월간 팬 투표 순위를 가져왔을 때의 응답',
      type: [MonthlyFanVoteDto],
    })(target, key, descriptor);

    ApiResponse({
      status: 400,
      description: 'type이 0 또는 1이 아닐 때의 응답',
    })(target, key, descriptor);

    ApiResponse({
      status: 500,
      description: '서버 오류 발생 시의 응답',
    })(target, key, descriptor);
  };
};

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

export const ApiVoteArtist = () => {
  return (target: any, key: string, descriptor: PropertyDescriptor) => {
    ApiOperation({
      summary: '아티스트 투표',
      description: '아티스트에게 투표한다.',
    })(target, key, descriptor);

    ApiResponse({
      status: 200,
      description: '성공적으로 투표했을 때의 응답',
      type: VoteResultDto,
    })(target, key, descriptor);

    ApiResponse({
      status: 400,
      description: '투표권을 불러오는데 실패했을 때의 응답',
    })(target, key, descriptor);

    ApiResponse({
      status: 500,
      description: '서버 오류 발생 시의 응답',
    })(target, key, descriptor);
  };
};

class voteCountResponse {
  @ApiProperty({ example: 25, description: '사용자 보유 투표권 개수' })
  voteCount: number;
}

export const ApiVote = () => {
  return (target: any, key: string, descriptor: PropertyDescriptor) => {
    ApiOperation({
      summary: '사용자 보유 투표권 개수 조회',
      description: '사용자의 보유 투표권 개수를 조회한다.',
    })(target, key, descriptor);

    ApiResponse({
      status: 200,
      description: '성공적으로 투표했을 때의 응답',
      type: voteCountResponse,
    })(target, key, descriptor);

    ApiResponse({
      status: 400,
      description: '투표권을 불러오는데 실패했을 때의 응답',
    })(target, key, descriptor);

    ApiResponse({
      status: 500,
      description: '서버 오류 발생 시의 응답',
    })(target, key, descriptor);
  };
};
