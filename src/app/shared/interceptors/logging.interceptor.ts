import { HttpEventType, type HttpInterceptorFn } from '@angular/common/http';
import { catchError, tap } from 'rxjs';

export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req)
    .pipe(
      tap(event => {
        if (event.type === HttpEventType.Response) {
          console.log(req.url, 'returned a response with status', event.status);
        }
      }),
      catchError(error => {
        console.error('HTTP Error:', error);
        throw error;
      })
    )
};
