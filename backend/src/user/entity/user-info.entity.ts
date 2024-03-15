import {
  BaseEntity,
  Column,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('user_info', { database: 'tniverse' })
export class UserInfoEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column('varchar', { length: 64, name: 'external_id' })
  externalId: string;

  @Column('tinyint', {
    name: 'login_type',
    comment: '0: kakao, 1: naver',
    unsigned: true,
  })
  loginType: number;

  @Column('tinyint', {
    name: 'status',
    comment: '0: inactive, 1: active, 2: deleted',
    unsigned: true,
    default: () => "'1'",
  })
  status: number;

  @Column('text', { name: 'refresh_token', nullable: true })
  refreshToken?: string;

  @Column('text', { name: 'email', nullable: true })
  email: string | null;

  @Column('int', { name: 'birth_year', unsigned: true, nullable: true })
  birthYear?: number;
}
