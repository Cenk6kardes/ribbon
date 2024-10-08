import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IGatewayControllerData, IInformationGWElement } from 'src/app/shared/models/network-view';
import { environment } from 'src/environments/environment';
import { LmmRestService } from './lmm-rest.service';

@Injectable({
  providedIn: 'root'
})
export class NetworkViewService {
  apiPath = environment.host + '/NvApi/nv/v1.0';

  constructor(private restService: LmmRestService) { }

  // Provides access to all information about a GW element.
  getAllInformationGWElement(gateway: string): Observable<IInformationGWElement> {
    return this.restService.getDataBody(`${this.apiPath}/gatewayData/${gateway}`);
  }

  // the remote interface containing access to all the GWC data, query with the name of the GWC.
  getGWCData(gwcID: string): Observable<IGatewayControllerData> {
    return this.restService.getDataBody(`${this.apiPath}/gwcData/${gwcID}`);
  }

  getCMCLLI(): Observable<string> {
    return this.restService.getStringDataBody(`${this.apiPath}/cm-clli`);
  }
}
