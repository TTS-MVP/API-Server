import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserInfoEntity } from './entity/user-info.entity';
import { UserProfileEntity } from './entity/user-profile.entity';
import { AuthKakaoModule } from 'src/auth-kakao/auth-kakao.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserInfoEntity, UserProfileEntity]),
    AuthKakaoModule,
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
