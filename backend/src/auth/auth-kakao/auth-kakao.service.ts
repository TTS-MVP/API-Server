import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { GlobalException, ResponseDto } from 'src/common/dto/response.dto';

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
    const { id } = kakaoUserInfo;
    let email = null;
    if (kakaoUserInfo.kakao_account.has_email) {
      email = kakaoUserInfo.kakao_account.email;
    }
    const { nickname, thumbnail_image_url } =
      kakaoUserInfo.kakao_account.profile;
    const { birthyear } = kakaoUserInfo.kakao_account;
    return {
      id,
      nickname,
      email,
      thumbnailUrl: thumbnail_image_url,
      birthyear,
    };
  }
}
