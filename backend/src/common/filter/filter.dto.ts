import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { GlobalException } from '../dto/response.dto';

@Catch(GlobalException)
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: GlobalException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const { statusCode, message } = exception.getResponse() as any; // Note: 'as any' is used here to bypass TypeScript type checking

    response.status(statusCode).json({
      success: false,
      statusCode,
      message,
    });
  }
}
