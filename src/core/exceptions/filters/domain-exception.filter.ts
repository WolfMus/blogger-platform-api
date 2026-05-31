import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { DomainException } from '../domain-exception';

@Catch(DomainException)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: DomainException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.code;

    if (status === HttpStatus.UNAUTHORIZED) {
      return response.sendStatus(status);
    }

    return response.status(status).json({
      errorMessages: [
        {
          message: exception.extensions[0].message,
          field: exception.extensions[0].field,
        },
      ],
    });
  }
}
