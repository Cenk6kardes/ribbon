import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { StorageService } from '../services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private storageService: StorageService
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.checkUserLogged();
  }

  checkUserLogged(): Observable<boolean> {
    return new Observable<boolean>(observer => {
      if (this.isUserLogged()) {
        return observer.next(true);
      }
      return observer.next(false);
    });
  }

  isUserLogged(): boolean {
    return !!this.storageService.sessionId;
  }
}
