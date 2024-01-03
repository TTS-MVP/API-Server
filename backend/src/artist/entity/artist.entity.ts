import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('artist', { database: 'tniverse' })
export class ArtistEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column('varchar', { length: 30 })
  name: string;

  @Column('int', { name: 'likes_count', unsigned: true, default: 0 })
  likesCount: number;

  @Column('text', { name: 'thumbnail_url' })
  thumbnailUrl: string;
}
