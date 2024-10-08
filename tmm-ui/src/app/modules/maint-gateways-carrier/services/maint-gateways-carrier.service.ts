import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TrunkMtcResourceInterfaceService } from 'src/app/services/api/trunk-mtc-resource-interface.service';
import { ITrunkMtcResourceInterface } from 'src/app/shared/models/trunk-mtc-resource-interface';

@Injectable({
  providedIn: 'root'
})
export class MaintGatewaysCarrierService {
  constructor(private trunkMtcResourceInterfaceService: TrunkMtcResourceInterfaceService) { }

  genericCommandToPerformMaintenanceOrQuerying(
    command: string,
    dataBody: ITrunkMtcResourceInterface[] = [],
    sSecurityInfo?: string
  ) {
    return this.trunkMtcResourceInterfaceService.genericCommandToPerformMaintenanceOrQuerying(command, dataBody, sSecurityInfo);
  }
}
