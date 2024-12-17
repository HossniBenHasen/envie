import { CallHandler, ConflictException, ExecutionContext, HttpException, Injectable, NestInterceptor } from '@nestjs/common';
import { catchError, Observable, throwError } from 'rxjs';
import { QueryFailedError } from 'typeorm';

@Injectable()
export class QueryUniqueViolationInterceptor implements NestInterceptor {

  private readonly errorMessage: string;

  constructor(errorMessage: string) {
    this.errorMessage = errorMessage;
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError(err => {
        if (err instanceof HttpException && err.cause instanceof QueryFailedError && err.cause.driverError.code == '23505') {
          return throwError(() => new ConflictException(this.errorMessage))
        }
        return throwError(() => err);
      })
    );
  }
}
