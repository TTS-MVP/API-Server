import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { HomeService } from './home.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth-guard.service';
import { ApiGetHome } from './decorator/swagger.decorator';
import { GlobalException, ResponseDto } from 'src/common/dto/response.dto';

@ApiTags('홈')
@UseGuards(AuthGuard)
@ApiBearerAuth('accessToken')
@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @ApiGetHome()
  @Get()
  async getHome(@Req() request: Request) {
    const userId = request['userInfo'].userId;
    if (!userId) throw new GlobalException('유저 정보가 없습니다.', 400);
    const home = await this.homeService.getHome(userId);
    return new ResponseDto(true, 200, '홈 조회 성공', home);
  }
}
