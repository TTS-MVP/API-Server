import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user_info', { database: 'tniverse' })
export class UserInfoEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column('tinyint', {
    name: 'login_type',
    comment: '0: kakao, 1: naver',
    unsigned: true,
  })
  loginType: number;

  @Column('varchar', { length: 30, name: 'user_name' })
  userName: string;

  @Column('tinyint', {
    name: 'status',
    comment: '0: inactive, 1: active, 2: deleted',
    unsigned: true,
    default: () => "'1'",
  })
  status: number;
}
