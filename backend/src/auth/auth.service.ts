import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { GlobalException } from 'src/common/dto/response.dto';

@Injectable()
export class AuthService {
  constructor(private readonly configService: ConfigService) {}

  async createAccessToken(userId: number) {
    const payload = { user_id: userId };
    const accessToken = jwt.sign(
      payload,
      this.configService.get('JWT_SECRET'),
      {
        expiresIn: this.configService.get('ACCESS_TOKEN_EXPIRATION_TIME'),
      },
    );
    return accessToken;
  }

  async createRefreshToken(userId: number) {
    const payload = { user_id: userId };
    const refreshToken = jwt.sign(
      payload,
      this.configService.get('JWT_SECRET'),
      {
        expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRATION_TIME'),
      },
    );
    return refreshToken;
  }

  verify(token: string) {
    try {
      const payload = jwt.verify(
        token,
        this.configService.get('JWT_SECRET'),
      ) as jwt.JwtPayload & { user_id: number };
      return {
        userId: payload['user_id'],
      };
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError)
        throw new GlobalException('토큰이 만료되었습니다.', 401);
      throw new UnauthorizedException();
    }
  }

  verifyBoolean(token: string) {
    try {
      jwt.verify(token, this.configService.get('JWT_SECRET'));
      return true;
    } catch (error) {
      return false;
    }
  }
}
