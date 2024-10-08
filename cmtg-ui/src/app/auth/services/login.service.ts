import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { AuthenticationService } from './authentication.service';
import { StorageService } from 'src/app/services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(private authService: AuthenticationService, private storageService: StorageService) { }

  login(username: string, password: string) {
    return this.authService.login(username, password);
  }

  isLoginSuccess(res: any): boolean {
    const sessionIdTemp = res?.body?.sessionId || '';
    this.storageService.sessionId = sessionIdTemp;
    this.authService.getPermissionInfo(sessionIdTemp).subscribe({
      next: (resPermissionInfo) => {
        const principalsTemp = resPermissionInfo.principals;
        if (principalsTemp.length > 0) {
          this.storageService.userID = principalsTemp[0]?.name ? principalsTemp[0].name : '';
          this.storageService.hostName = principalsTemp[1]?.name ? principalsTemp[1].name : '';
        }
      }
    });
    return true;
  }

  getErrorMessage(error: any): Observable<string> {
    return of(error.error.message);
  }

  parseError(error: any): string {
    return error;
  }

  parsePasswordChange(res: any): boolean {
    return false;
  }
}
