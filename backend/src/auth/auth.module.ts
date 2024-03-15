import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthKakaoModule } from './auth-kakao/auth-kakao.module';
import { AuthKakaoService } from './auth-kakao/auth-kakao.service';
import { AuthNaverService } from './auth-naver/auth-naver.service';

@Module({
  imports: [AuthKakaoModule],
  providers: [AuthService, AuthKakaoService, AuthNaverService],
  exports: [AuthService, AuthKakaoService, AuthNaverService],
})
export class AuthModule {}
