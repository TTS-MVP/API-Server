import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthKakaoService } from 'src/auth-kakao/auth-kakao.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authKakaoService: AuthKakaoService,
  ) {}

  @Get('login')
  async login() {
    const token = 'test';
    return await this.authKakaoService.checkKakaoAccessToken(token);
  }
}
