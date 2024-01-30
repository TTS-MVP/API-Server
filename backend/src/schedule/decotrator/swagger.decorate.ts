import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

export const ApiGetRecentSchedules = () => {
  return (target: any, key: string, descriptor: PropertyDescriptor) => {
    ApiOperation({
      summary: '최근 일정 조회',
      description:
        '홈 화면에서 사용할 일정 조회 API입니다. 최대 5개의 일정을 가져옵니다.',
    })(target, key, descriptor);

    ApiResponse({
      status: 200,
      description: '성공적으로 최근 일정을 가져왔을 때의 응답',
    })(target, key, descriptor);

    ApiResponse({
      status: 400,
      description: '서버 오류 발생 시의 응답',
    })(target, key, descriptor);

    ApiResponse({
      status: 500,
      description: '데이터베이스 오류 발생 시의 응답',
    })(target, key, descriptor);
  };
};

export const ApiGetSchedules = () => {
  return (target: any, key: string, descriptor: PropertyDescriptor) => {
    ApiOperation({
      summary: '일정 조회',
      description: '일정을 조회한다.',
    })(target, key, descriptor);

    ApiParam({
      name: 'year',
      required: true,
      description: '조회할 일정의 연도',
      example: 2024,
    })(target, key, descriptor);

    ApiParam({
      name: 'month',
      required: true,
      description: '조회할 일정의 월',
      example: 1,
    })(target, key, descriptor);

    ApiResponse({
      status: 200,
      description: '성공적으로 일정을 가져왔을 때의 응답',
    })(target, key, descriptor);

    ApiResponse({
      status: 400,
      description: '서버 오류 발생 시의 응답',
    })(target, key, descriptor);

    ApiResponse({
      status: 500,
      description: '데이터베이스 오류 발생 시의 응답',
    })(target, key, descriptor);
  };
};
