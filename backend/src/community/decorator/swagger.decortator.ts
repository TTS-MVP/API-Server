import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiProperty,
  ApiResponse,
  OmitType,
} from '@nestjs/swagger';
import { DetailFeedDto, FeedsDto } from '../dto/get-feed.dto';
import {
  CreateCommentDto,
  DeleteCommentResponseDto,
} from '../dto/create-comment.dto';
import { CommentDto } from '../dto/comment.dto';

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
    ApiConsumes('multipart/form-data')(target, key, descriptor);

    ApiOperation({
      summary: '피드 생성',
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

export const ApiUpdateFeed = () => {
  return (target: any, key: string, descriptor: PropertyDescriptor) => {
    ApiConsumes('multipart/form-data')(target, key, descriptor);

    ApiOperation({
      summary: '피드 수정',
      description: '피드를 수정한다.',
    })(target, key, descriptor);

    ApiParam({
      name: 'feedId',
      required: true,
      description: '피드 고유 식별자',
      example: 1,
    })(target, key, descriptor);

    ApiResponse({
      status: 200,
      description: '성공적으로 피드를 수정했을 때의 응답',
    })(target, key, descriptor);

    ApiResponse({
      status: 400,
      description: '피드를 수정하는데 실패했을 때의 응답',
    })(target, key, descriptor);

    ApiResponse({
      status: 403,
      description: '피드 수정 권한이 없을 때(작성자가 아닐 때)의 응답',
    })(target, key, descriptor);

    ApiResponse({
      status: 500,
      description: '서버 오류 발생 시의 응답',
    })(target, key, descriptor);
  };
};

export const ApiDeleteFeed = () => {
  return (target: any, key: string, descriptor: PropertyDescriptor) => {
    ApiOperation({
      summary: '피드 삭제',
      description: '피드를 삭제한다.',
    })(target, key, descriptor);

    ApiParam({
      name: 'feedId',
      required: true,
      description: '피드 고유 식별자',
      example: 1,
    })(target, key, descriptor);

    ApiResponse({
      status: 200,
      description: '성공적으로 피드를 삭제했을 때의 응답',
    })(target, key, descriptor);

    ApiResponse({
      status: 400,
      description: '피드를 삭제하는데 실패했을 때의 응답',
    })(target, key, descriptor);

    ApiResponse({
      status: 403,
      description: '피드 수정 권한이 없을 때(작성자가 아닐 때)의 응답',
    })(target, key, descriptor);

    ApiResponse({
      status: 500,
      description: '서버 오류 발생 시의 응답',
    })(target, key, descriptor);
  };
};

export const ApiCreateComment = () => {
  return (target: any, key: string, descriptor: PropertyDescriptor) => {
    ApiOperation({
      summary: '댓글 생성',
      description: '댓글을 생성한다.',
    })(target, key, descriptor);

    ApiParam({
      name: 'feedId',
      required: true,
      description: '피드 고유 식별자',
      example: 1,
    })(target, key, descriptor);

    ApiResponse({
      status: 200,
      description: '성공적으로 댓글을 생성했을 때의 응답',
      type: CreateCommentDto,
    })(target, key, descriptor);

    ApiResponse({
      status: 400,
      description: '댓글을 생성하는데 실패했을 때의 응답',
    })(target, key, descriptor);

    ApiResponse({
      status: 500,
      description: '서버 오류 발생 시의 응답',
    })(target, key, descriptor);
  };
};

export const ApiUpdateComment = () => {
  return (target: any, key: string, descriptor: PropertyDescriptor) => {
    ApiOperation({
      summary: '댓글 수정',
      description: '댓글을 수정한다.',
    })(target, key, descriptor);

    ApiParam({
      name: 'commentId',
      required: true,
      description: '댓글 고유 식별자',
      example: 1,
    })(target, key, descriptor);

    ApiResponse({
      status: 200,
      description: '성공적으로 댓글을 수정했을 때의 응답',
      type: OmitType(CommentDto, ['userProfile']),
    })(target, key, descriptor);

    ApiResponse({
      status: 400,
      description: '댓글을 수정하는데 실패했을 때의 응답',
    })(target, key, descriptor);

    ApiResponse({
      status: 403,
      description: '댓글 수정 권한이 없을 때(작성자가 아닐 때)의 응답',
    })(target, key, descriptor);

    ApiResponse({
      status: 500,
      description: '서버 오류 발생 시의 응답',
    })(target, key, descriptor);
  };
};

export const ApiDeleteComment = () => {
  return (target: any, key: string, descriptor: PropertyDescriptor) => {
    ApiOperation({
      summary: '댓글 삭제',
      description: '댓글을 삭제한다.',
    })(target, key, descriptor);

    ApiParam({
      name: 'commentId',
      required: true,
      description: '댓글 고유 식별자',
      example: 1,
    })(target, key, descriptor);

    ApiResponse({
      status: 200,
      description: '성공적으로 댓글을 삭제했을 때의 응답',
      type: DeleteCommentResponseDto,
    })(target, key, descriptor);

    ApiResponse({
      status: 400,
      description: '댓글을 삭제하는데 실패했을 때의 응답',
    })(target, key, descriptor);

    ApiResponse({
      status: 403,
      description: '댓글 삭제 권한이 없을 때(작성자가 아닐 때)의 응답',
    })(target, key, descriptor);

    ApiResponse({
      status: 500,
      description: '서버 오류 발생 시의 응답',
    })(target, key, descriptor);
  };
};

class LikeDto {
  @ApiProperty({
    example: 10,
    description: '좋아요 개수',
  })
  likeCount: number;
}

export const ApiCreateLike = () => {
  return (target: any, key: string, descriptor: PropertyDescriptor) => {
    ApiOperation({
      summary: '좋아요 생성',
      description: '좋아요를 생성한다.',
    })(target, key, descriptor);

    ApiParam({
      name: 'feedId',
      required: true,
      description: '피드 고유 식별자',
      example: 1,
    })(target, key, descriptor);

    ApiResponse({
      status: 200,
      description: '성공적으로 좋아요를 생성했을 때의 응답',
      type: LikeDto,
    })(target, key, descriptor);

    ApiResponse({
      status: 400,
      description: '좋아요를 생성하는데 실패했을 때의 응답',
    })(target, key, descriptor);

    ApiResponse({
      status: 500,
      description: '서버 오류 발생 시의 응답',
    })(target, key, descriptor);
  };
};

export const ApiDeleteLike = () => {
  return (target: any, key: string, descriptor: PropertyDescriptor) => {
    ApiOperation({
      summary: '좋아요 삭제',
      description: '좋아요를 삭제한다.',
    })(target, key, descriptor);

    ApiParam({
      name: 'feedId',
      required: true,
      description: '피드 고유 식별자',
      example: 1,
    })(target, key, descriptor);

    ApiResponse({
      status: 200,
      description: '성공적으로 좋아요를 삭제했을 때의 응답',
      type: LikeDto,
    })(target, key, descriptor);

    ApiResponse({
      status: 400,
      description: '좋아요를 삭제하는데 실패했을 때의 응답',
    })(target, key, descriptor);

    ApiResponse({
      status: 500,
      description: '서버 오류 발생 시의 응답',
    })(target, key, descriptor);
  };
};
