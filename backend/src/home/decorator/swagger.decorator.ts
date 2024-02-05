import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { homeDTO } from '../dto/home.dto';

export const ApiGetHome = () => {
  return (target: any, key: string, descriptor: PropertyDescriptor) => {
    ApiOperation({
      summary: '홈 조회',
      description: '홈을 조회한다.',
    })(target, key, descriptor);

    ApiResponse({
      status: 200,
      description: '성공적으로 홈을 조회했을 때의 응답',
      type: homeDTO,
    })(target, key, descriptor);

    ApiResponse({
      status: 400,
      description: '실패했을 때의 응답',
    })(target, key, descriptor);

    ApiResponse({
      status: 500,
      description: '서버 에러',
    })(target, key, descriptor);
  };
};
