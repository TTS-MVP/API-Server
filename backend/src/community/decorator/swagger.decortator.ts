import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { DetailFeedDto, FeedsDto } from '../dto/get-feed.dto';

export const ApiGetFeed = () => {
  return (target: any, key: string, descriptor: PropertyDescriptor) => {
    ApiOperation({
      summary: '피드 조회',
      description: '피드를 조회한다.',
    })(target, key, descriptor);

    ApiResponse({
      status: 200,
      description: '성공적으로 피드를 가져왔을 때의 응답',
      type: FeedsDto,
    })(target, key, descriptor);

    ApiResponse({
      status: 400,
      description: '피드를 가져오는 데 실패했을 때의 응답',
    })(target, key, descriptor);

    ApiResponse({
      status: 500,
      description: '서버 오류 발생 시의 응답',
    })(target, key, descriptor);
  };
};

export const ApiCreateFeed = () => {
  return (target: any, key: string, descriptor: PropertyDescriptor) => {
    ApiOperation({
      summary: '피드 생성(아직 개발중)',
      description: '피드를 생성한다.',
    })(target, key, descriptor);

    ApiResponse({
      status: 200,
      description: '성공적으로 피드를 생성했을 때의 응답',
    })(target, key, descriptor);

    ApiResponse({
      status: 400,
      description: '피드를 생성하는데 데 실패했을 때의 응답',
    })(target, key, descriptor);

    ApiResponse({
      status: 500,
      description: '서버 오류 발생 시의 응답',
    })(target, key, descriptor);
  };
};

export const ApiGetFeedById = () => {
  return (target: any, key: string, descriptor: PropertyDescriptor) => {
    ApiOperation({
      summary: '상세 피드 조회',
      description: '피드를 상세 조회한다.',
    })(target, key, descriptor);

    ApiParam({
      name: 'feedId',
      required: true,
      description: '피드 고유 식별자',
      example: 1,
    })(target, key, descriptor);

    ApiResponse({
      status: 200,
      description: '성공적으로 피드를 가져왔을 때의 응답',
      type: DetailFeedDto,
    })(target, key, descriptor);

    ApiResponse({
      status: 400,
      description: '피드를 가져오는 데 실패했을 때의 응답',
    })(target, key, descriptor);

    ApiResponse({
      status: 500,
      description: '서버 오류 발생 시의 응답',
    })(target, key, descriptor);
  };
};
