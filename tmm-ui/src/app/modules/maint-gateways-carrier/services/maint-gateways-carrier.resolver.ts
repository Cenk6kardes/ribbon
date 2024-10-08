import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { TranslateInternalService } from 'src/app/services/translate-internal.service';

@Injectable({
  providedIn: 'root'
})
export class MaintGatewaysCarrierResolver implements Resolve<boolean> {
  constructor(private translateService: TranslateInternalService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    if (state.url.includes('maintenance-by-carrier')) {
      return of({ typeMaintenance: 'BY_CARRIER', title: this.translateService.translateResults.MAI_GATE_WAYS_CARRIER.TITLE_CARRIER });
    }
    return of({ typeMaintenance: 'BY_GATEWAYS', title: this.translateService.translateResults.MAI_GATE_WAYS_CARRIER.TITLE_GATEWAYS });
  }
}
