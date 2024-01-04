import { Module } from '@nestjs/common';
import { AuthKakaoService } from './auth-kakao.service';

@Module({
  providers: [AuthKakaoService],
  exports: [AuthKakaoService],
})
export class AuthKakaoModule {}
