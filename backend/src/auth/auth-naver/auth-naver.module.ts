import { Module } from '@nestjs/common';
import { AuthNaverService } from './auth-naver.service';

@Module({
  providers: [AuthNaverService],
  exports: [AuthNaverService],
})
export class AuthKakaoModule {}
