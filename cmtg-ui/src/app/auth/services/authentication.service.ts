import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

import { CmtgRestService } from 'src/app/services/api/cmtg-rest.service';
import { StorageService } from '../../services/storage.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { IPermissionInfo } from '../models/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  apiPath = environment.host + '/LoginApi/auth-service/v1.0/';

  autoLogoutSubject$ = new BehaviorSubject<boolean>(false);

  constructor(
    private restService: CmtgRestService,
    private storageService: StorageService
  ) {}

  login(username: string, password: string) {
    const url = this.apiPath + 'session';
    const body = {
      name: username,
      password: password
    };
    return this.restService.post(url, body);
  }

  logOut() {
    const url = this.apiPath + `session/${this.storageService.sessionId}`;
    return this.restService.delete(url, undefined, 'text');
  }

  getCLLI() {
    const url = this.apiPath + 'cm-clli';
    return this.restService.getStringDataBody(url);
  }

  getTimeoutValue() {
    const url = this.apiPath + 'session/time-out';
    return this.restService.getStringDataBody(url);
  }

  refreshUserSession() {
    const body = {
      sessionId: this.storageService.sessionId
    };
    const url = this.apiPath + 'session';
    return this.restService.put(url, body);
  }

  validateSession() {
    const url =
      this.apiPath + `session/validation/${this.storageService.sessionId}`;
    return this.restService.getStringDataBody(url);
  }

  getPermissionInfo(sessionId: string): Observable<IPermissionInfo> {
    const url = this.apiPath + 'session/permission/' + sessionId;
    return this.restService.getDataBody(url);
  }
}
