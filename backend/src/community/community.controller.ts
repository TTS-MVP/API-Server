import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommunityService } from './community.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth-guard.service';
import { ResponseDto } from 'src/common/dto/response.dto';
import {
  ApiCreateFeed,
  ApiGetFeed,
  ApiGetFeedById,
} from './decorator/swagger.decortator';
import { CreateFeedDto } from './dto/create-feed.dto';

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
  async createFeed(@Req() request, @Body() createFeedDto: CreateFeedDto) {
    const userId = request['userInfo'].userId;
    if (!userId) throw new Error('유저 정보가 없습니다.');
    const feed = await this.communityService.createFeed(userId, createFeedDto);
    return new ResponseDto(true, 200, '피드 생성 성공', feed);
  }
}
