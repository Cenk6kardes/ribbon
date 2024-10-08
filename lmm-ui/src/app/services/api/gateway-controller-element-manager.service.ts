import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  IEndpointSearchResult,
  IGateway, IGateWayController , IProperties
} from 'src/app/shared/models/gateway-controller-element-manager';
import { environment } from 'src/environments/environment';
import { LmmRestService } from './lmm-rest.service';
@Injectable({
  providedIn: 'root'
})
export class GatewayControllerElementManagerService {
  apiPath = `${environment.host}/GwcemApi/gwcem/v1.0`;

  constructor(private restService: LmmRestService) { }

  // Returns the data a given gateway
  getGateway(gwcID: string, gwName: string): Observable<IGateway> {
    return this.restService.getDataBody(`${this.apiPath}/gatewayData/${gwcID}/${gwName}`);
  }

  // get LMM Line Gateway Names
  getLMMLineGatewayNames(gwName: string): Observable<string[]> {
    return this.restService.getDataBody(`${this.apiPath}/lmm-gateways/${gwName}`);
  }

  // get list of GWC devices with status
  getGWCList(): Observable<IGateWayController[]> {
    const url = `${this.apiPath}/gwc-status-list`;
    return this.restService.getDataBody(url);
  }

  // Get properties from file
  getProperties(fromFile: boolean): Observable<IProperties[]> {
    return this.restService.getDataBody(`${this.apiPath}/properties/${fromFile}`);
  }
  // Search for endpoints ordered by extTerminalNumber by using the different fields in the endpoints structre as filters
  getEndpointsOrdered(epData: string, isMG9K: boolean): Observable<IEndpointSearchResult> {
    const url = `${this.apiPath}/endpoint-by-filter/${epData}/${isMG9K}`;
    return this.restService.getDataBody(url);
  }

  getMiddleBoxIp(middleBoxName: string): Observable<string> {
    const url = `${this.apiPath}/middlebox-ip/${middleBoxName}`;
    return this.restService.getStringDataBody(url);
  }

}
