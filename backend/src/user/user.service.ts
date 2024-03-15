import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { AuthKakaoService } from 'src/auth/auth-kakao/auth-kakao.service';
import { AuthNaverService } from 'src/auth/auth-naver/auth-naver.service';
import { AuthService } from 'src/auth/auth.service';
import { GlobalException, ResponseDto } from 'src/common/dto/response.dto';
import { Repository } from 'typeorm';
import { UserInfoEntity } from './entity/user-info.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserProfileEntity } from './entity/user-profile.entity';
import { ArtistService } from 'src/artist/artist.service';
import { VoteService } from 'src/vote/vote.service';
import { UserProfileDTO } from './dto/profile.dto';
import { StorageService } from 'src/storage/storage.service';

@Injectable()
export class UserService {
  constructor(
    private readonly authKakaoService: AuthKakaoService,
    private readonly authNaverService: AuthNaverService,
    private readonly authService: AuthService,
    private readonly storageService: StorageService,
    private readonly artistService: ArtistService,
    @Inject(forwardRef(() => VoteService))
    private readonly voteService: VoteService,
    @InjectRepository(UserInfoEntity)
    private readonly userInfoRepository: Repository<UserInfoEntity>,
    @InjectRepository(UserProfileEntity)
    private readonly userProfileRepository: Repository<UserProfileEntity>,
  ) {}
  async register(userProfile, imageFile) {
    const isExistUser = await this.getUserInfoByUserId(userProfile.id);
    if (!isExistUser) {
      throw new GlobalException(
        '존재하지 않는 사용자입니다. id값을 다시 확인해주세요.',
        400,
      );
    }
    let user = await this.getUserProfileByUserId(userProfile.id);
    // 기존 사진이 존재하면 삭제한다.
    if (
      user &&
      user.thumbnailUrl.startsWith('https://storage.googleapis.com')
    ) {
      await this.storageService.deleteImageByUrl(user.thumbnailUrl);
    }
    if (imageFile) {
      try {
        const path = `user/${userProfile.id}`;
        // 이미지를 저장한다.
        const imageUrl = await this.storageService.saveImage(path, imageFile);
        userProfile.thumbnailUrl = imageUrl;
      } catch (err) {
        throw new GlobalException('프로필 사진 저장에 실패했습니다.', 500);
      }
    } else if (userProfile.thumbnailUrl) {
    } else {
      userProfile.thumbnailUrl =
        'https://storage.googleapis.com/tniverse-seoul-dev-storage-01/base-image.png';
    }
    delete userProfile.imageFile;
    if (!user) await this.saveUserProfile(userProfile);
    else {
      await this.updateUserProfile(userProfile);
    }
  }
  async login(socialLoginType: number, oauthAccessToken: string) {
    let userId;
    let externalId;
    let socialData;
    let accessToken, refreshToken;
    let userProfileData;
    switch (socialLoginType) {
      case 0: // 카카오
        socialData =
          await this.authKakaoService.getKakaoUserIdByKakaoAccessToken(
            oauthAccessToken,
          ); // 카카오 액세스 토큰 확인
        externalId = socialData.id;
        break;
      case 1: // 네이버
        socialData =
          await this.authNaverService.getNaverUserIdByNaverAccessToken(
            oauthAccessToken,
          );
        externalId = socialData.id;
        break;
      default:
        return new ResponseDto(
          false,
          400,
          '유효하지 않은 소셜 로그인 타입입니다.',
        );
    }
    const isExistUser = await this.getUserInfoByUserExternalId(externalId); // 소셜 아이디로 유저 조회

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
          formattedSocialData = await this.authNaverService.formatNaverUserInfo(
            socialData,
          );
          break;
      }
      console.log(formattedSocialData);
      const userInfo = {
        externalId,
        loginType: socialLoginType,
        status: 1,
        email: formattedSocialData.email,
        birthYear: formattedSocialData.birthyear,
      };
      await this.userInfoRepository.save(userInfo);
      userId = (await this.getUserInfoByUserExternalId(externalId)).id;
      const userProfile = {
        id: userId,
        nickName: formattedSocialData.nickname,
        thumbnailUrl: formattedSocialData.thumbnailUrl,
      };
      userProfileData = await this.userProfileRepository.save(userProfile);
      refreshToken = await this.authService.createRefreshToken(userId);
      await this.userInfoRepository.update(
        { id: userId },
        { refreshToken: refreshToken },
      );
    }
    // 유저가 존재하면 로그인
    else {
      refreshToken = await this.authService.createRefreshToken(isExistUser.id);
      await this.userInfoRepository.update(
        { id: isExistUser.id },
        { refreshToken: refreshToken },
      );
    }

    // 액세스, 리프레시 토큰 발급
    accessToken = await this.authService.createAccessToken(userId);

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

  async getUserInfoByUserExternalId(externalId: string) {
    const userData = await this.userInfoRepository.findOne({
      where: { externalId: externalId },
    });
    return userData;
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

  async saveUserInfo(userInfo: UserInfoEntity): Promise<UserInfoEntity> {
    const savedUserInfo = await this.userInfoRepository.save(userInfo);
    return savedUserInfo;
  }

  async saveUserProfile(
    userProfile: UserProfileEntity,
  ): Promise<UserProfileEntity> {
    const savedUserProfile = await this.userProfileRepository.save(userProfile);
    return savedUserProfile;
  }

  async updateUserProfile(userProfile: UserProfileEntity) {
    await this.userProfileRepository.update(userProfile.id, userProfile);
  }

  async getProfile(userId: number): Promise<UserProfileDTO> {
    // 유저 정보 조회
    const userProfileData = await this.getUserProfileByUserId(userId);
    if (!userProfileData) {
      throw new GlobalException('존재하지 않는 사용자입니다.', 404);
    }
    // 데이터 전처리
    delete userProfileData.createdAt;
    delete userProfileData.updatedAt;

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
    delete favoriteArtistProfile.youtubeChannelId;

    // 데이터 전처리
    delete userProfileData.favoriteArtistId;

    // 랭킹 조회
    const rank = await this.voteService.getUserRank(0, userId);
    const artistRank = await this.voteService.getUserRank(1, userId);

    // 이번 달 투표 횟수 조회
    const voteCount = await this.voteService.getUserVoteById(userId);

    return {
      userProfile: {
        ...userProfileData,
        voteCount,
        registedAt: Math.floor(
          (Date.now() - userProfileData.registedAt.getTime()) / 86400000,
        ),
        contribution: fanContribution,
        rank: rank,
        artistRank: artistRank,
      },

      favoriteArtistProfile: favoriteArtistProfile,
    };
  }
}
