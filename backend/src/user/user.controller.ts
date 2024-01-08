import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';
import { ApiLogin } from './decorator/swagger.decorator';
import { SocialLoginTypeDto } from 'src/auth/dto/auth.dto';
import { ResponseDto } from 'src/common/dto/response.dto';

@ApiTags('유저')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiLogin()
  @Post('login')
  async login(@Body() socialLoginTypeDto: SocialLoginTypeDto) {
    const { loginType: socialLoginType, accessToken } = socialLoginTypeDto;
    const data = await this.userService.login(socialLoginType, accessToken);
    return new ResponseDto(true, 200, '로그인 성공', data);
  }
}
