import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorResponseDto } from '../dto/error-response.dto';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    if (status === 400) {
      const errorResponse: ErrorResponseDto = {
        errors: [],
      };
      const responseBody = exception.getResponse() as {
        message: Array<{ field: string; message: string }>;
        error?: string;
        statusCode?: number;
      };

      if (Array.isArray(responseBody.message)) {
        responseBody.message.forEach((m) =>
          errorResponse.errors.push({
            field: m.field,
            message: m.message,
          }),
        );
      } else if (typeof responseBody.message === 'string') {
        errorResponse.errors.push({
          field: 'asd',
          message: 'm.message',
        });
      }
      response.status(status).json(errorResponse);
      return;
    }

    return response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
