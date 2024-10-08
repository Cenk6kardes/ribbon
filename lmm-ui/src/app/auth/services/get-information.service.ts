import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { PROJECT_NAME } from 'src/app/types/const';

@Injectable({
  providedIn: 'root'
})
export class GetInformationService {

  constructor() { }

  getInformation(): Observable<HttpResponse<any>> {
    const data = {
      project: PROJECT_NAME.toUpperCase(),
      version: '',
      banner: ''
    };
    return of(new HttpResponse({ body: data }));
  }

  parseProject(res: HttpResponse<any>): string {
    return res.body?.project;
  }

  parseVersion(res: HttpResponse<any>): string {
    return res.body?.version;
  }

  parseBanner(res: HttpResponse<any>): string {
    return res.body?.banner;
  }
}
