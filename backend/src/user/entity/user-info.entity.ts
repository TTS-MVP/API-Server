import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('user_info', { database: 'tniverse' })
export class UserInfoEntity extends BaseEntity {
  @PrimaryColumn({ type: 'int', unsigned: true, unique: false })
  id: number;

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

  @Column('text', { name: 'refresh_token' })
  refreshToken: string;

  @Column('text', { name: 'email', nullable: true })
  email: string | null;
}
