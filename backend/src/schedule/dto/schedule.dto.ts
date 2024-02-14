import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class EventDto {
  @Expose()
  @ApiProperty({ example: 1, description: '일정 타입' })
  type: number;

  @Expose()
  @ApiProperty({
    example: '2024-02-14T11:49:25.000Z',
    description: '일정 시작일',
  })
  startAt: Date;

  @Expose()
  @ApiProperty({ example: '데뷔일', description: '일정 내용' })
  content: string;
}

export class ScheduleDto {
  @ApiProperty({ type: [EventDto], description: '일정 목록' })
  @Type(() => EventDto)
  date: EventDto[];
}
