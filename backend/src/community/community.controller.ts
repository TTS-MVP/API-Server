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
  ApiCreateFeed,
  ApiDeleteFeed,
  ApiGetFeed,
  ApiGetFeedById,
  ApiUpdateFeed,
} from './decorator/swagger.decortator';
import { CreateFeedDto } from './dto/create-feed.dto';
import { FileInterceptor } from '@nestjs/platform-express/multer';

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
  async updateFeed(
    @Param('feedId') feedId: number,
    @Req() request: Request,
    @Body() createFeedDto: CreateFeedDto,
  ) {
    const userId = request['userInfo'].userId;
    if (!userId) throw new Error('유저 정보가 없습니다.');
    const feed = await this.communityService.updateFeed(
      feedId,
      userId,
      createFeedDto,
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
}
