import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('artist', { database: 'tniverse' })
export class ArtistEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column('varchar', { length: 30 })
  name: string;

  @Column('text', { name: 'thumbnail_url' })
  thumbnailUrl: string;

  @Column('text', { name: 'youtube_channel_id' })
  youtubeChannelId: string;
}
