import { ApiProperty } from '@nestjs/swagger';

export class ResponseDto<T = any> {
  @ApiProperty({ example: true, description: '응답 성공 여부' })
  success: boolean;

  @ApiProperty({ example: 200, description: 'HTTP 상태 코드' })
  statusCode: number;

  @ApiProperty({ example: 'Success', description: '응답 메시지' })
  message: string;

  @ApiProperty({ description: '실제 데이터' })
  data: T;

  constructor(success: boolean, statusCode: number, message: string, data: T) {
    this.success = success;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }
}
