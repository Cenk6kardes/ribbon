import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { AuthenticationService } from './authentication.service';
import { StorageService } from 'src/app/services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  usernameTemp = '';
  constructor(private authService: AuthenticationService, private storageService: StorageService ) { }

  login(username: string, password: string) {
    this.usernameTemp = username;
    return this.authService.login(username, password);
  }

  isLoginSuccess(res: any): boolean {
    this.storageService.sessionId = res?.body?.sessionId || '';
    this.storageService.userID = this.usernameTemp;
    this.usernameTemp = '';
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
