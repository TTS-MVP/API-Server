import { Column, Entity, PrimaryGeneratedColumn, ViewEntity } from 'typeorm';

@Entity('vote', { database: 'tniverse' })
export class VoteEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column('int', { name: 'artist_id', unsigned: true })
  artistId: number;

  @Column('int', { name: 'user_id', unsigned: true })
  userId: number;

  @Column('int', { name: 'vote_count', unsigned: true })
  voteCount: number;

  @Column('datetime', {
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
}
