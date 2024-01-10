import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';
import { ApiLogin, ApiRegister } from './decorator/swagger.decorator';
import { SocialLoginTypeDto } from 'src/auth/dto/auth.dto';
import { ResponseDto } from 'src/common/dto/response.dto';
import { CreateUserDto } from './dto/create-user.dto';

@ApiTags('유저')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiLogin()
  @Post('login')
  async login(@Body() socialLoginTypeDto: SocialLoginTypeDto) {
    const { loginType: socialLoginType, accessToken } = socialLoginTypeDto;
    const data = await this.userService.login(socialLoginType, accessToken);
    let message, statusCode;
    if (data['isExistUser'] === false) {
      message = '유저 정보 조회 성공';
      statusCode = 201;
    } else {
      message = '로그인 성공';
      statusCode = 200;
    }
    return new ResponseDto(true, statusCode, message, data);
  }

  @ApiRegister()
  @Post('register')
  async register(@Body() userProfile: CreateUserDto) {
    await this.userService.register(userProfile);
    return new ResponseDto(true, 201, '회원가입 성공');
  }
}
