import { ArtistEntity } from 'src/artist/entity/artist.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user_profile', { database: 'tniverse' })
export class UserProfileEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column('varchar', { length: 30, name: 'nick_name' })
  nickName: string;

  @Column('text', { name: 'thumbnail_url' })
  thumbnailUrl: string;
}
