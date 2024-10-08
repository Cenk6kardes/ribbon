import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { TmmRestService } from './tmm-rest.service';
import { ITrunkMtcResourceInterface, IObjectAnyKey } from 'src/app/shared/models/trunk-mtc-resource-interface';

@Injectable({
  providedIn: 'root'
})
export class TrunkMtcResourceInterfaceService {
  apiPath = environment.host + '/TmmApi/tmm/v1.0';

  constructor(private restService: TmmRestService) { }

  /**
    * Generic command to perform maintenance or querying on either a gateway's endpoints or a trunk's members
    * @param command Wide open
    * @param dataBody data body
    * @param sSecurityInfo Who is requesting the command (such as User ID) for logging purposes only
    */
  genericCommandToPerformMaintenanceOrQuerying(
    command: string,
    dataBody: ITrunkMtcResourceInterface[] = [],
    sSecurityInfo?: string
  ): Observable<IObjectAnyKey> {
    let internalPath = `maintenance/${command}`;
    if (sSecurityInfo) {
      internalPath = `maintenance/${command}/${sSecurityInfo}`;
    }
    return this.restService.put(`${this.apiPath}/${internalPath}`, dataBody);
  }
}
