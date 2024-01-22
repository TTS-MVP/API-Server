import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CommunityService } from './community.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth-guard.service';
import { ResponseDto } from 'src/common/dto/response.dto';
import {
  ApiCreateComment,
  ApiCreateFeed,
  ApiCreateLike,
  ApiDeleteComment,
  ApiDeleteFeed,
  ApiDeleteLike,
  ApiGetFeed,
  ApiGetFeedById,
  ApiUpdateComment,
  ApiUpdateFeed,
} from './decorator/swagger.decortator';
import { CreateFeedDto } from './dto/create-feed.dto';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { CreateCommentDto } from './dto/create-comment.dto';

@ApiTags('커뮤니티')
@UseGuards(AuthGuard)
@ApiBearerAuth('accessToken')
@Controller('community')
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  @ApiGetFeed()
  @Get()
  async getFeed(@Req() request) {
    const userId = request['userInfo'].userId;
    if (!userId) throw new Error('유저 정보가 없습니다.');
    const feeds = await this.communityService.getFeed(userId);
    return new ResponseDto(true, 200, '피드 조회 성공', feeds);
  }

  @ApiGetFeedById()
  @Get(':feedId')
  async getFeedById(@Param('feedId') feedId: number) {
    const feed = await this.communityService.getFeedById(feedId);
    return new ResponseDto(true, 200, '상세 피드 조회 성공', feed);
  }

  @ApiCreateFeed()
  @Post()
  @UseInterceptors(FileInterceptor('imageFile'))
  async createFeed(
    @Req() request,
    @Body() createFeedDto: CreateFeedDto,
    @UploadedFile() imageFile?: Express.Multer.File,
  ) {
    const userId = request['userInfo'].userId;
    if (!userId) throw new Error('유저 정보가 없습니다.');
    const feed = await this.communityService.createFeed(
      userId,
      createFeedDto,
      imageFile,
    );
    return new ResponseDto(true, 200, '피드 생성 성공', feed);
  }

  @ApiUpdateFeed()
  @Put(':feedId')
  @UseInterceptors(FileInterceptor('imageFile'))
  async updateFeed(
    @Param('feedId') feedId: number,
    @Req() request: Request,
    @Body() createFeedDto: CreateFeedDto,
    @UploadedFile() imageFile?: Express.Multer.File,
  ) {
    const userId = request['userInfo'].userId;
    if (!userId) throw new Error('유저 정보가 없습니다.');
    console.log(userId);
    const feed = await this.communityService.updateFeed(
      feedId,
      userId,
      createFeedDto,
      imageFile,
    );
    return new ResponseDto(true, 200, '피드 수정 성공', feed);
  }

  @ApiDeleteFeed()
  @Delete(':feedId')
  async deleteFeed(@Param('feedId') feedId: number, @Req() request: Request) {
    const userId = request['userInfo'].userId;
    if (!userId) throw new Error('유저 정보가 없습니다.');
    const feed = await this.communityService.deleteFeed(feedId, userId);
    return new ResponseDto(true, 200, '피드 삭제 성공');
  }

  // TODO: 댓글
  @ApiCreateComment()
  @Post(':feedId/comment')
  async createComment(
    @Param('feedId') feedId: number,
    @Req() request: Request,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    const userId = request['userInfo'].userId;
    if (!userId) throw new Error('유저 정보가 없습니다.');
    const { content } = createCommentDto;
    const feed = await this.communityService.createComment(
      feedId,
      userId,
      content,
    );
    return new ResponseDto(true, 200, '댓글 생성 성공', feed);
  }

  @ApiUpdateComment()
  @Put('/comment/:commentId')
  async updateComment(
    @Param('commentId') commentId: number,
    @Req() request: Request,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    const userId = request['userInfo'].userId;
    if (!userId) throw new Error('유저 정보가 없습니다.');
    const { content } = createCommentDto;
    const feed = await this.communityService.updateComment(
      commentId,
      userId,
      content,
    );
    return new ResponseDto(true, 200, '댓글 수정 성공', feed);
  }

  @ApiDeleteComment()
  @Delete('/comment/:commentId')
  async deleteComment(
    @Param('commentId') commentId: number,
    @Req() request: Request,
  ) {
    const userId = request['userInfo'].userId;
    if (!userId) throw new Error('유저 정보가 없습니다.');
    const feed = await this.communityService.deleteComment(commentId, userId);
    return new ResponseDto(true, 200, '댓글 삭제 성공');
  }

  // TODO: 좋아요 하기
  @ApiCreateLike()
  @Post(':feedId/like')
  async createLike(@Param('feedId') feedId: number, @Req() request: Request) {
    const userId = request['userInfo'].userId;
    if (!userId) throw new Error('유저 정보가 없습니다.');
    const likeCount = await this.communityService.createLike(feedId, userId);
    return new ResponseDto(true, 200, '좋아요 성공', { likeCount });
  }

  @ApiDeleteLike()
  @Delete(':feedId/like')
  async deleteLike(@Param('feedId') feedId: number, @Req() request: Request) {
    const userId = request['userInfo'].userId;
    if (!userId) throw new Error('유저 정보가 없습니다.');
    const likeCount = await this.communityService.deleteLike(feedId, userId);
    return new ResponseDto(true, 200, '좋아요 취소 성공', { likeCount });
  }
}
