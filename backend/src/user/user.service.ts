import { Injectable } from '@nestjs/common';
import { AuthKakaoService } from 'src/auth/auth-kakao/auth-kakao.service';
import { AuthService } from 'src/auth/auth.service';
import { ResponseDto } from 'src/common/dto/response.dto';
import { Repository } from 'typeorm';
import { UserInfoEntity } from './entity/user-info.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { format } from 'path';

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
    let socialData;
    let accessToken, refreshToken;
    switch (socialLoginType) {
      case 0: // 카카오
        socialData =
          await this.authKakaoService.getKakaoUserIdByKakaoAccessToken(
            kakaoAccessToken,
          ); // 카카오 액세스 토큰 확인
        userId = socialData.id;
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
    const isExistUser = await this.getUserInfoByUserId(userId); // 카카오 사용자 아이디로 유저 조회

    // 액세스, 리프레시 토큰 발급
    [accessToken, refreshToken] = await Promise.all([
      this.authService.createAccessToken(userId),
      this.authService.createRefreshToken(userId),
    ]);

    // 유저가 존재하지 않으면 회원가입
    if (!isExistUser) {
      let formattedSocialData;
      switch (socialLoginType) {
        case 0: // 카카오
          formattedSocialData = await this.authKakaoService.formatKakaoUserInfo(
            socialData,
          ); // 카카오 사용자 정보 포맷
          break;
        case 1: // 네이버
          break;
      }
      const userInfo = new UserInfoEntity();
      userInfo.id = userId;
      userInfo.userName = formattedSocialData.name;
      userInfo.loginType = socialLoginType;
      userInfo.status = 1;
      userInfo.refreshToken = refreshToken;
      const savedUserInfo = await this.saveUserInfo(userInfo); // 유저 정보 저장
      // TODO: userProfile 저장
    }
    // 유저가 존재하면 로그인
    else {
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

  async saveUserInfo(userInfo: UserInfoEntity) {
    const savedUserInfo = await this.userInfoRepository.save(userInfo);
    return savedUserInfo;
  }
}
