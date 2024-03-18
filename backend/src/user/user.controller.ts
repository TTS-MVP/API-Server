import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  ApiCheckToken,
  ApiLogin,
  ApiProfile,
  ApiRegister,
} from './decorator/swagger.decorator';
import { SocialLoginTypeDto } from 'src/auth/dto/auth.dto';
import { ResponseDto } from 'src/common/dto/response.dto';
import { AuthGuard } from 'src/auth/auth-guard.service';
import { VoteService } from 'src/vote/vote.service';
import { ApiVote } from 'src/vote/decorator/swagger.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CheckTokenDTO } from './dto/jwt.dto';
import { AuthService } from 'src/auth/auth.service';

@ApiTags('유저')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly voteService: VoteService,
    private readonly authService: AuthService,
  ) {}

  @ApiCheckToken()
  @Post('check-token')
  async checkToken(@Body() checkTokenDTO: CheckTokenDTO) {
    const { accessToken } = checkTokenDTO;
    this.authService.verify(accessToken);
    return new ResponseDto(true, 200, '토큰 검증 성공');
  }

  @ApiLogin()
  @Post('login')
  @HttpCode(200)
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
  @UseInterceptors(FileInterceptor('imageFile'))
  async register(
    @Body() userProfile: CreateUserDto,
    @UploadedFile() imageFile?: Express.Multer.File,
  ) {
    await this.userService.register(userProfile, imageFile);
    return new ResponseDto(true, 201, '회원가입 성공');
  }

  @ApiVote()
  @UseGuards(AuthGuard)
  @ApiBearerAuth('accessToken')
  @Get('vote')
  async getUserVote(@Req() request) {
    const userId = request['userInfo'].userId;
    const data = await this.voteService.getUserVoteById(userId);
    return new ResponseDto(true, 200, '유저 투표 조회 성공', {
      voteCount: data,
    });
  }

  @ApiProfile()
  @UseGuards(AuthGuard)
  @ApiBearerAuth('accessToken')
  @Get('profile')
  async getProfile(@Req() request) {
    const userId = request['userInfo'].userId;
    const data = await this.userService.getProfile(userId);
    return new ResponseDto(true, 200, '프로필 조회 성공', data);
  }
}
