import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('user_profile', { database: 'tniverse' })
export class UserProfileEntity {
  @PrimaryColumn({ type: 'int', unsigned: true })
  id: number;

  @Column('varchar', { length: 30, name: 'nick_name' })
  nickName: string;

  @Column('text', { name: 'thumbnail_url' })
  thumbnailUrl: string;

  @Column('int', { name: 'favorite_artist_id', unsigned: true, nullable: true })
  favoriteArtistId?: number;

  @CreateDateColumn({ name: 'registed_at' })
  registedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
