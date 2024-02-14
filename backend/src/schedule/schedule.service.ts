import { Injectable } from '@nestjs/common';
import { ScheduleEntity } from './entity/schedule.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { GlobalException } from 'src/common/dto/response.dto';
import { convertToSeoulTimezone } from 'src/common/format/timezone.format';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(ScheduleEntity)
    private readonly scheduleRepository: Repository<ScheduleEntity>,
    private readonly userService: UserService,
  ) {}
  private formatScheduleType(type: number) {
    switch (type) {
      case 1:
        return '방송';
      case 2:
        return '행사';
      case 3:
        return '기념일';
      default:
        return '기타';
    }
  }

  private getSchedulesByDate(
    artistId: number,
    startDate: Date,
    endDate: Date,
    limit?: number,
  ): Promise<ScheduleEntity[]> {
    let schedules = this.scheduleRepository.find({
      select: ['type', 'startAt', 'content'],
      where: {
        artistId,
        startAt: Between(startDate, endDate),
      },
      order: {
        startAt: 'ASC',
      },
      take: limit,
    });

    // 오늘 데이터가 적으면 지난 일정 중 추가로 가져오기
    schedules = schedules.then((schedules) => {
      if (schedules.length < limit) {
        const todayDate = new Date(startDate);
        todayDate.setHours(0, 0, 0, 0);
        return this.scheduleRepository
          .find({
            select: ['type', 'startAt', 'content'],
            where: {
              artistId,
              startAt: Between(todayDate, startDate),
            },
            order: {
              startAt: 'DESC',
            },
            take: limit - schedules.length,
          })
          .then((prevSchedules) => {
            return [...prevSchedules, ...schedules];
          });
      }
      return schedules;
    });

    return schedules;
  }

  private groupSchedulesByDate(schedules: ScheduleEntity[]) {
    const groupedSchedules: Record<string, ScheduleEntity[]> = {};

    schedules.forEach((schedule) => {
      const dateKey = schedule.startAt.toISOString().split('T')[0];

      if (!groupedSchedules[dateKey]) {
        groupedSchedules[dateKey] = [];
      }

      groupedSchedules[dateKey].push(schedule);
    });

    return groupedSchedules;
  }

  public async getSchedules(userId: number, year: number, month: number) {
    const userFavoriteArtistId = (
      await this.userService.getUserProfileByUserId(userId)
    ).favoriteArtistId;

    if (!userFavoriteArtistId) {
      throw new GlobalException('최애 아티스트를 설정해주세요.', 400);
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const schedules = await this.getSchedulesByDate(
      userFavoriteArtistId,
      startDate,
      endDate,
    );

    schedules.forEach((schedule) => {
      schedule.type = this.formatScheduleType(schedule.type) as any;
    });

    const groupedSchedules = this.groupSchedulesByDate(schedules);

    return groupedSchedules;
  }

  public async getRecentSchedules(userId: number) {
    const userFavoriteArtistId = (
      await this.userService.getUserProfileByUserId(userId)
    ).favoriteArtistId;

    if (!userFavoriteArtistId) {
      throw new GlobalException('최애 아티스트를 설정해주세요.', 400);
    }

    const startDate = convertToSeoulTimezone(new Date());
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 2);

    const schedules = await this.getSchedulesByDate(
      userFavoriteArtistId,
      startDate,
      endDate,
      5,
    );

    schedules.forEach((schedule) => {
      schedule.type = this.formatScheduleType(schedule.type) as any;
    });

    const groupedSchedules = this.groupSchedulesByDate(schedules);

    return groupedSchedules;
  }
}
