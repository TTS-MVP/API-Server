import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ArtistDto } from '../dto/artist.dto';

export const ApiGetAllArtists = () => {
  return (target: any, key: string, descriptor: PropertyDescriptor) => {
    ApiOperation({
      summary: '아티스트 조회',
      description:
        '아티스트들을 좋아요 순으로 정렬하고, 좋아요가 같으면 이름 순으로 정렬한다.',
    })(target, key, descriptor);

    ApiResponse({
      status: 200,
      description: '성공적으로 아티스트 목록을 가져왔을 때의 응답',
      type: [ArtistDto],
    })(target, key, descriptor);

    ApiResponse({
      status: 500,
      description: '서버 오류 발생 시의 응답',
    })(target, key, descriptor);
  };
};
