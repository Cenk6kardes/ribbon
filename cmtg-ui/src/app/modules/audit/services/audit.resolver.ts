import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { CTypeDataIntegrity } from '../models/audit';

@Injectable({
  providedIn: 'root'
})
export class AuditResolver implements Resolve<boolean> {
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const pathSplit = state?.url?.split('/');
    if (pathSplit?.includes(CTypeDataIntegrity.c20DataIntegrityAudit.stateUrl)) {
      return of({ auditDataIntegrity: CTypeDataIntegrity.c20DataIntegrityAudit });
    }
    if (pathSplit?.includes(CTypeDataIntegrity.lineDataIntegrityAudit.stateUrl)) {
      return of({ auditDataIntegrity: CTypeDataIntegrity.lineDataIntegrityAudit });
    }
    if (pathSplit?.includes(CTypeDataIntegrity.trunkDataIntegrityAudit.stateUrl)) {
      return of({ auditDataIntegrity: CTypeDataIntegrity.trunkDataIntegrityAudit });
    }
    if (pathSplit?.includes(CTypeDataIntegrity.V52DataIntegrityAudit.stateUrl)) {
      return of({ auditDataIntegrity: CTypeDataIntegrity.V52DataIntegrityAudit });
    }
    if (pathSplit?.includes(CTypeDataIntegrity.smallLineDataIntegrityAudit.stateUrl)) {
      return of({ auditDataIntegrity: CTypeDataIntegrity.smallLineDataIntegrityAudit });
    }
    return of({ auditDataIntegrity: undefined });
  }
}
