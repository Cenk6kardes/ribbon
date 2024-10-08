import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuditService } from 'src/app/modules/audit/services/audit.service';
@Injectable({
  providedIn: 'root'
})
export class V52Guard implements CanActivate {
  constructor(private auditService: AuditService) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.auditService.isV52Supported().pipe(
      map((isV52Supported) => {
        if (isV52Supported) {
          return true;
        } else {
          return false;
        }
      })
    );
  }
}
