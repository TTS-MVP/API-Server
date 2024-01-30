import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth-guard.service';
import { ResponseDto } from 'src/common/dto/response.dto';
import {
  ApiGetRecentSchedules,
  ApiGetSchedules,
} from './decotrator/swagger.decorate';

@ApiTags('일정')
@UseGuards(AuthGuard)
@ApiBearerAuth('accessToken')
@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @ApiGetSchedules()
  @Get(':year/:month')
  async getSchedules(
    @Req() request,
    @Param('year') year: number,
    @Param('month') month: number,
  ) {
    const userId = request['userInfo'].userId;
    if (!userId) throw new Error('유저 정보가 없습니다.');
    const schedules = await this.scheduleService.getSchedules(
      userId,
      year,
      month,
    );
    return new ResponseDto(true, 200, '일정 조회 성공', schedules);
  }
}
