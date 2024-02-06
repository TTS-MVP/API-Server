import { UserProfileEntity } from 'src/user/entity/user-profile.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { FeedEntity } from './feed.entity';

@Entity('comment', { database: 'tniverse' })
export class CommentEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column('int', { name: 'user_id', unsigned: true })
  userId: number;
  @ManyToOne(() => UserProfileEntity, (userProfile) => userProfile.comments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  userProfile?: UserProfileEntity;

  @Column('int', { name: 'feed_id', unsigned: true })
  feedId: number;
  @ManyToOne(() => FeedEntity, (feed) => feed.comments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'feed_id' })
  feed?: UserProfileEntity;

  @Column('text', { name: 'content' })
  content: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt?: Date;

  @Column('tinyint', { name: 'status', unsigned: true, default: () => "'1'" })
  status?: number;
}
