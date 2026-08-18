import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Catch, HttpStatus } from '@nestjs/common';

import { InvalidTourStateTransitionError, TourDomainError } from '@/admin/tours/domain/errors';

@Catch(TourDomainError)
export class TourDomainExceptionFilter implements ExceptionFilter {
  catch(exception: TourDomainError, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse();
    const status =
      exception instanceof InvalidTourStateTransitionError
        ? HttpStatus.CONFLICT
        : HttpStatus.BAD_REQUEST;

    response.status(status).json({
      statusCode: status,
      message: exception.message,
      error: exception.name,
    });
  }
}
