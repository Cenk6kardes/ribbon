import { Injectable } from '@angular/core';

import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageService } from '../services/storage.service';
import { catchError } from 'rxjs/operators';
import { AuthenticationService } from '../auth/services/authentication.service';

@Injectable()
export class CmtgInterceptor implements HttpInterceptor {
  excludedUrls: string[] = [
    '.json',
    '/LoginApi/auth-service/v1.0/session',
    '/LoginApi/auth-service/v1.0/session/time-out',
    '/LoginApi/auth-service/v1.0/cm-clli',
    '/LoginApi/auth-service/v1.0/session/permission',
    '/LoginApi/auth-service/v1.0/session/validation'
  ];

  constructor(
    private storageService: StorageService,
    private authService: AuthenticationService
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    // set default Content-Type is application/json
    const headers: any = {
      'Content-Type': 'application/json'
    };
    if (this.isValidRequestForInterceptor(request.url)) {
      headers['session-id'] = this.storageService.sessionId;
    }
    const reqCopy = request.clone({
      setHeaders: headers
    });

    return next.handle(reqCopy).pipe(
      catchError((err: any) => {
        if (
          err.error.errorCode === '500' &&
          err.error.message.startsWith('Unable to connect')
        ) {
          this.authService.autoLogoutSubject$.next(true);
        }
        throw err;
      })
    );
  }

  isValidRequestForInterceptor(url: string) {
    return this.excludedUrls.findIndex((item) => url.includes(item)) === -1;
  }
}
