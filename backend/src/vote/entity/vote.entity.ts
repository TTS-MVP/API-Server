import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('vote', { database: 'tniverse' })
export class VoteEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column('int', { name: 'artist_id', unsigned: true })
  artistId: number;

  @Column('int', { name: 'user_id', unsigned: true })
  userId: number;

  @Column('int', { name: 'vote_count', unsigned: true })
  voteCount: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
