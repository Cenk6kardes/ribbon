import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

import { RestService } from 'rbn-common-lib';

@Injectable({
  providedIn: 'root'
})
export class TmmRestService extends RestService {

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  getDataBody(apiUrl: string): Observable<any> {
    return this.get(apiUrl)
      .pipe(
        map(d => {
          if (d.ok) {
            return d.body as any;
          }
          throwError('Error');
        }));
  }

  getStringDataBody(apiUrl: string): Observable<any> {
    return this.getString(apiUrl)
      .pipe(
        map(d => {
          if (d.ok) {
            return d.body as any;
          }
          throwError('Error');
        }));
  }

  postDataBody(apiUrl: string, data?: any): Observable<any> {
    return this.post(apiUrl, data).pipe(map(d => {
      if (d.ok) {
        return d.body as any;
      }
      throwError('Error');
    }));
  }

  putDataBody(apiUrl: string, data: any): Observable<any> {
    return this.put(apiUrl, data).pipe(map(d => {
      if (d.ok) {
        return d.body as any;
      }
      throwError('Error');
    }));
  }

  putDataParamBody(apiUrl: string, requestParams: HttpParams, data?: any): Observable<any> {
    return this.putWithHttpParams(apiUrl, data, requestParams).pipe(map(d => {
      if (d.ok) {
        return d.body as any;
      }
      throwError('Error');
    }));
  }
}
