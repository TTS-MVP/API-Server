import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('vote_acquisition_history', { database: 'tniverse' })
export class VoteAcquisitionHistoryEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column('int', { name: 'user_id', unsigned: true })
  userId: number;

  @Column('int', { name: 'vote_count', unsigned: true })
  voteCount: number;

  @Column('tinyint', { name: 'type', unsigned: true })
  type: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
