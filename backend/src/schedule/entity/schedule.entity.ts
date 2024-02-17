import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('schedule', { database: 'tniverse' })
export class ScheduleEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column('int', { name: 'artist_id', unsigned: true })
  artistId: number;

  @Column('tinyint', {
    unsigned: true,
    comment: '0: 방송, 1: 행사, 2: 기념일, 3: 기타',
  })
  type: number;

  @Column('datetime', { name: 'start_at' })
  startAt: Date;

  @Column('text')
  content: string;
}
