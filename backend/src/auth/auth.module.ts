import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthKakaoModule } from './auth-kakao/auth-kakao.module';
import { AuthKakaoService } from './auth-kakao/auth-kakao.service';

@Module({
  imports: [AuthKakaoModule],
  providers: [AuthService, AuthKakaoService],
  exports: [AuthService, AuthKakaoService],
})
export class AuthModule {}
