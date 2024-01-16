import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { AuthKakaoService } from 'src/auth/auth-kakao/auth-kakao.service';
import { AuthService } from 'src/auth/auth.service';
import { GlobalException, ResponseDto } from 'src/common/dto/response.dto';
import { Repository } from 'typeorm';
import { UserInfoEntity } from './entity/user-info.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserProfileEntity } from './entity/user-profile.entity';
import { ArtistService } from 'src/artist/artist.service';
import { VoteService } from 'src/vote/vote.service';

@Injectable()
export class UserService {
  constructor(
    private readonly authKakaoService: AuthKakaoService,
    private readonly authService: AuthService,
    private readonly artistService: ArtistService,
    @Inject(forwardRef(() => VoteService))
    private readonly voteService: VoteService,
    @InjectRepository(UserInfoEntity)
    private readonly userInfoRepository: Repository<UserInfoEntity>,
    @InjectRepository(UserProfileEntity)
    private readonly userProfileRepository: Repository<UserProfileEntity>,
  ) {}
  async register(userProfile) {
    const isExistUser = await this.getUserInfoByUserId(userProfile.id);
    if (!isExistUser) {
      throw new GlobalException(
        '존재하지 않는 사용자입니다. id값을 다시 확인해주세요.',
        400,
      );
    } else {
      await this.saveUserProfile(userProfile);
    }
  }
  async login(socialLoginType: number, kakaoAccessToken: string) {
    let userId;
    let socialData;
    let accessToken, refreshToken;
    let userProfileData;
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
    const isExistUser = await this.getUserInfoByUserId(userId); // 소셜 아이디로 유저 조회

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
      const userInfo = {
        id: userId,
        loginType: socialLoginType,
        status: 1,
        refreshToken: refreshToken,
        email: formattedSocialData.email,
      };
      const userProfile = {
        id: userId,
        nickName: formattedSocialData.nickname,
        thumbnailUrl: formattedSocialData.thumbnailUrl,
      };
      await this.saveUserInfo(userInfo);
      userProfileData = await this.saveUserProfile(userProfile);
    }
    // 유저가 존재하면 로그인
    else {
      await this.userInfoRepository.update(
        { id: userId },
        { refreshToken: refreshToken },
      );
    }
    return {
      isExistUser: isExistUser ? true : false,
      // userProfileData에서 createdAt, updatedAt, registedAt 제거
      userProfileData: userProfileData
        ? {
            ...userProfileData,
            createdAt: undefined,
            updatedAt: undefined,
            registedAt: undefined,
            favoriteArtistId: undefined,
          }
        : undefined,
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

  async getUserProfileByUserId(userId: number) {
    const userProfileData = await this.userProfileRepository.findOne({
      where: { id: userId },
    }); // 카카오 사용자 아이디로 유저 조회
    return userProfileData;
  }

  async saveUserInfo(userInfo: UserInfoEntity) {
    const savedUserInfo = await this.userInfoRepository.save(userInfo);
    return savedUserInfo;
  }

  async saveUserProfile(userProfile: UserProfileEntity) {
    const savedUserProfile = await this.userProfileRepository.save(userProfile);
    return savedUserProfile;
  }

  async getProfile(userId: number) {
    // 유저 정보 조회
    const userProfileData = await this.getUserProfileByUserId(userId);
    if (!userProfileData) {
      throw new GlobalException('존재하지 않는 사용자입니다.', 404);
    }
    // 데이터 전처리
    delete userProfileData.createdAt;
    delete userProfileData.updatedAt;
    delete userProfileData.registedAt;

    // 최애 아티스트 프로필 조회
    const favoriteArtistId = userProfileData.favoriteArtistId;
    const favoriteArtistProfile = await this.artistService.getArtistById(
      favoriteArtistId,
    );
    if (!favoriteArtistProfile) {
      throw new GlobalException('존재하지 않는 아티스트입니다.', 404);
    }
    // 기여도 계산
    const fanContribution = await this.voteService.getFanContribution(
      userId,
      favoriteArtistId,
    );

    // 데이터 전처리
    delete userProfileData.favoriteArtistId;

    return {
      userProfile: userProfileData,
      favoriteArtistProfile: favoriteArtistProfile,
      contribution: fanContribution,
    };
  }
}
