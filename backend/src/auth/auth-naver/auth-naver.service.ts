import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { GlobalException, ResponseDto } from 'src/common/dto/response.dto';

@Injectable()
export class AuthNaverService {
  async getNaverUserIdByNaverAccessToken(accessToken: string) {
    try {
      // 네이버 액세스 토큰으로 네이버 사용자 정보 가져오기
      const user = await axios.get('https://openapi.naver.com/v1/nid/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return user.data.response;
    } catch (error) {
      throw new GlobalException('유효하지 않은 토큰입니다.', 400);
    }
  }

  async formatNaverUserInfo(naverUserInfo) {
    const { id, email, nickname, profile_image, birthyear } = naverUserInfo;
    return {
      id,
      nickname,
      email,
      thumbnailUrl: profile_image,
      birthyear,
    };
  }
}
