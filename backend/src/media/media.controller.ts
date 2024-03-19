import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { MediaService } from './media.service';
import { GlobalException, ResponseDto } from 'src/common/dto/response.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth-guard.service';
import { ApiGetMedia } from './decorator/swagger.decorator';
import { VideoItemDTO } from './dto/media.dto';

@ApiTags('미디어')
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @ApiGetMedia()
  @Get()
  async getMedia(@Req() request): Promise<ResponseDto<VideoItemDTO[]>> {
    const userId = request['userInfo']?.userId;
    if (!userId) throw new GlobalException('유저 정보가 없습니다.', 400);
    const medias = await this.mediaService.getMedia(userId);
    return new ResponseDto(true, 200, '미디어 조회 성공', medias);
  }

  @Post('test')
  async test(@Req() request) {
    console.log(request.body);
    const responseBody = {
      version: '2.0',
      template: {
        outputs: [
          {
            simpleText: {
              text: "hello I'm Ryan",
            },
          },
        ],
      },
    };
    return responseBody;
  }
}
