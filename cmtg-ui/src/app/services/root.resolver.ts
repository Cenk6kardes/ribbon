import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, forkJoin, of } from 'rxjs';
import { AuditService } from '../modules/audit/services/audit.service';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RootResolver implements Resolve<boolean> {
  constructor(private auditService: AuditService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const registeredAuditTemp = this.auditService.getRegisteredAudit().pipe(
      catchError(() => of(undefined)
      ));
    const isV52SupportedTemp = this.auditService.isV52Supported().pipe(
      catchError(() => of(undefined)
      ));
    const tzName = this.auditService.getAuditTimezone().pipe(
      catchError(() => of('')
      ));
    return forkJoin({ registeredAuditData: registeredAuditTemp, isV52SupportedData: isV52SupportedTemp, timeZoneName: tzName });
  }
}
