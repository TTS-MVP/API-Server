import { UserProfileEntity } from 'src/user/entity/user-profile.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CommentEntity } from './comment.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('feed', { database: 'tniverse' })
export class FeedEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column('int', { name: 'user_id', unsigned: true })
  userId: number;

  @Column('int', { name: 'favorite_artist_id', unsigned: true })
  @ApiProperty({
    example: 1,
    description: '피드 작성자가 좋아하는 아티스트의 아이디',
  })
  favoriteArtistId: number;

  @Column('text', { name: 'content' })
  content: string;

  @Column('text', { name: 'thumbnail_url', nullable: true })
  thumbnailUrl?: string | null;

  @Column('int', {
    name: 'like_count',
    unsigned: true,
    nullable: true,
    default: () => "'0'",
  })
  likeCount?: number;

  @CreateDateColumn({ name: 'created_at', nullable: true })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt?: Date;

  @Column('tinyint', {
    name: 'status',
    comment: '0: inactive, 1: active, 2: deleted',
    unsigned: true,
    nullable: true,
    default: () => "'1'",
  })
  status?: number;

  @OneToMany(() => CommentEntity, (comment) => comment.feed)
  comments?: CommentEntity[];

  @ManyToOne(() => UserProfileEntity, (userProfile) => userProfile.feeds, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  userProfile?: UserProfileEntity;
}
