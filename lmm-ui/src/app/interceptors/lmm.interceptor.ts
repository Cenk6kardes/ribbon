import { Injectable } from '@angular/core';

import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageService } from '../services/storage.service';

@Injectable()
export class LMMInterceptor implements HttpInterceptor {

  excludedUrls: string[] = [
    '.json',
    '/LoginApi/auth-service/v1.0/session',
    '/LoginApi/auth-service/v1.0/session/time-out',
    '/LoginApi/auth-service/v1.0/cm-clli',
    '/LoginApi/auth-service/v1.0/session/permission',
    '/LoginApi/auth-service/v1.0/session/validation'
  ];

  constructor(private storageService: StorageService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
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
    return next.handle(reqCopy);
  }

  isValidRequestForInterceptor(url: string) {
    return this.excludedUrls.findIndex(item => url.includes(item)) === -1;
  }
}
