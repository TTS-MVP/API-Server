import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('vote_acquisition_history', { database: 'tniverse' })
export class VoteAcquisitionHistoryEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column('int', { name: 'user_id', unsigned: true })
  userId: number;

  @Column('int', { name: 'vote_count', unsigned: true })
  voteCount: number;

  @Column('tinyint', {
    name: 'type',
    unsigned: true,
    comment:
      '0: 투표하기, 1: 출석체크, 2: 최애 일정 확인, 3: 커뮤니티 댓글 쓰기, 4: 커뮤니티 글쓰기',
  })
  type: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
