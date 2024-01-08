import { Injectable } from '@nestjs/common';
import { AuthKakaoService } from 'src/auth/auth-kakao/auth-kakao.service';
import { AuthService } from 'src/auth/auth.service';
import { ResponseDto } from 'src/common/dto/response.dto';
import { Repository } from 'typeorm';
import { UserInfoEntity } from './entity/user-info.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    private readonly authKakaoService: AuthKakaoService,
    private readonly authService: AuthService,
    @InjectRepository(UserInfoEntity)
    private readonly userInfoRepository: Repository<UserInfoEntity>,
  ) {}
  async login(socialLoginType: number, kakaoAccessToken: string) {
    let userId;
    let accessToken, refreshToken;
    switch (socialLoginType) {
      case 0: // 카카오
        const kakaoUserData =
          await this.authKakaoService.getKakaoUserIdByKakaoAccessToken(
            kakaoAccessToken,
          ); // 카카오 액세스 토큰 확인
        userId = kakaoUserData.id;
        break;
      case 1: // 네이버
        break;
      default:
        return new ResponseDto(
          false,
          400,
          '유효하지 않은 소셜 로그인 타입입니다.',
        );
    }
    console.log(userId);
    const isExistUser = await this.getUserInfoByUserId(userId); // 카카오 사용자 아이디로 유저 조회

    // 유저가 존재하지 않으면 회원가입
    if (!isExistUser) {
    }
    // 유저가 존재하면 로그인
    else {
      // TODO: 액세스, 리프레시 토큰 발급
      [accessToken, refreshToken] = await Promise.all([
        this.authService.createAccessToken(isExistUser.id),
        this.authService.createRefreshToken(isExistUser.id),
      ]);
      // TODO: 리프레시 토큰이 DB에 존재하면 수정
    }
    return {
      accessToken,
      refreshToken,
    };
  }

  async getUserInfoByUserId(userId: number) {
    const userData = await this.userInfoRepository.findOne({
      where: { id: userId },
    }); // 카카오 사용자 아이디로 유저 조회
    return userData;
  }
}
