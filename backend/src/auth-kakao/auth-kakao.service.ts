import { HttpException, Injectable } from '@nestjs/common';
import axios from 'axios';
import { ResponseDto } from 'src/common/dto/response.dto';

@Injectable()
export class AuthKakaoService {
  async checkKakaoAccessToken(accessToken: string) {
    let user;
    try {
      user = await axios.get('https://kapi.kakao.com/v2/user/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    } catch (err) {
      // TODO: 수정 필요
      throw new ResponseDto(
        false,
        400,
        '유효하지 않은 카카오 액세스 토큰입니다.',
      );
    }
    return user;
  }
}
