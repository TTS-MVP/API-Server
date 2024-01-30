import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsOptional } from 'class-validator';

export class ScheduleDto {
  type: number;
  startAt: Date;
  content: string;
}
