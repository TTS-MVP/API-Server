import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { VideoItemDTO } from '../dto/media.dto';

export const ApiGetMedia = () => {
  return (target: any, key: string, descriptor: PropertyDescriptor) => {
    ApiOperation({
      summary: '미디어 조회',
      description: '미디어를 조회한다.',
    })(target, key, descriptor);

    ApiResponse({
      status: 200,
      description: '성공적으로 미디어를 조회했을 때의 응답',
      type: [VideoItemDTO],
    })(target, key, descriptor);
  };
};
