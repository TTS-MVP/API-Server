import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  isExistUserLoginDto,
  isNotExistUserLoginDto,
} from '../dto/login-user.dto';

export const ApiLogin = () => {
  return (target: any, key: string, descriptor: PropertyDescriptor) => {
    ApiOperation({
      summary: '소셜 로그인 토큰 검증',
      description: `소셜 로그인 토큰을 검증한다. 검증에 성공하면 트니버스 서비스 토큰을 발급한다.  
        
      body 값으로 loginType과 accessToken을 받는다.  
      loginType은 0: 카카오, 1: 네이버이다.  
      accessToken은 카카오 또는 네이버 소셜 로그인 토큰이다.
        `,
    })(target, key, descriptor);

    ApiResponse({
      status: 200,
      description: '기존에 가입된 유저가 로그인한 경우의 응답',
      type: isExistUserLoginDto,
    })(target, key, descriptor);

    ApiResponse({
      status: 201,
      description: '신규 유저가 로그인한 경우의 응답',
      type: isNotExistUserLoginDto,
    })(target, key, descriptor);

    ApiResponse({
      status: 400,
      description: '유효하지 않은 카카오 액세스 토큰입니다.',
    })(target, key, descriptor);

    ApiResponse({
      status: 500,
      description: '서버 오류 발생 시의 응답',
    })(target, key, descriptor);
  };
};

export const ApiRegister = () => {
  return (target: any, key: string, descriptor: PropertyDescriptor) => {
    ApiOperation({
      summary: '회원가입',
      description: `회원가입을 한다.`,
    })(target, key, descriptor);

    ApiResponse({
      status: 201,
      description: '회원가입 성공 시의 응답',
    })(target, key, descriptor);

    ApiResponse({
      status: 400,
      description: '이미 회원가입 된 사용자입니다.',
    })(target, key, descriptor);

    ApiResponse({
      status: 500,
      description: '서버 오류 발생 시의 응답',
    })(target, key, descriptor);
  };
};
