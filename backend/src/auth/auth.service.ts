import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

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
    } catch {
      throw new UnauthorizedException();
    }
  }
}
