import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { GlobalException, ResponseDto } from 'src/common/dto/response.dto';
import { UserInfoEntity } from 'src/user/entity/user-info.entity';

@Injectable()
export class AuthKakaoService {
  async getKakaoUserIdByKakaoAccessToken(accessToken: string) {
    try {
      // 카카오 액세스 토큰으로 카카오 사용자 정보 가져오기
      const user = await axios.get('https://kapi.kakao.com/v2/user/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return user.data;
    } catch (error) {
      throw new GlobalException('유효하지 않은 토큰입니다.', 400);
    }
  }

  async formatKakaoUserInfo(kakaoUserInfo) {
    const id = kakaoUserInfo.id || null;
    const name = kakaoUserInfo.kakao_account?.name || null;
    const profile = kakaoUserInfo.kakao_account?.profile || {};
    const nickname = profile.nickname || null;
    const thumbnail_image_url = profile.thumbnail_image_url || null;


    return {
      id,
      name,
      nickname,
      thumbnailUrl: thumbnail_image_url,
    };
  }
}
