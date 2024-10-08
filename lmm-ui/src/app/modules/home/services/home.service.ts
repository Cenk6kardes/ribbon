import { Injectable } from '@angular/core';

import { GatewayControllerElementManagerService } from 'src/app/services/api/gateway-controller-element-manager.service';
import { LineMaintenanceManagerService } from 'src/app/services/api/line-maintenance-manager.service';
import { NetworkViewService } from 'src/app/services/api/network-view.service';

import { ILineRequest } from 'src/app/shared/models/line-maintenance-manager';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  constructor(
    private lineMaintenanceManagerService: LineMaintenanceManagerService,
    private gatewayControllerElementManagerService: GatewayControllerElementManagerService,
    private networkViewService: NetworkViewService
  ) { }

  getLineInformationByDNAndCLLI(dn: string, clli: string) {
    return this.lineMaintenanceManagerService.getLineInformationByDNAndCLLI(dn, clli);
  }

  getLinePostInformation(line: ILineRequest) {
    return this.lineMaintenanceManagerService.getLinePostInformation(line);
  }

  getGateway(gwcID: string, gwName: string) {
    return this.gatewayControllerElementManagerService.getGateway(gwcID, gwName);
  }

  getAllInformationGWElement(gateway: string) {
    return this.networkViewService.getAllInformationGWElement(gateway);
  }

  getEndpointStateInformation(gwc_address: string, cm_tid: string) {
    return this.lineMaintenanceManagerService.getEndpointStateInformation(gwc_address, cm_tid);
  }

  getLMMLineGatewayNames(gwName: string) {
    return this.gatewayControllerElementManagerService.getLMMLineGatewayNames(gwName);
  }

  getGWCData(gwcID: string) {
    return this.networkViewService.getGWCData(gwcID);
  }

  getLineInformationByTIDAndCLLI(tid: string, clli: string) {
    return this.lineMaintenanceManagerService.getLineInformationByTIDAndCLLI(tid, clli);
  }

  getProperties(fromFile: boolean) {
    return this.gatewayControllerElementManagerService.getProperties(fromFile);
  }


  getEndpointsOrdered(epData: string, isMG9K: boolean) {
    return this.gatewayControllerElementManagerService.getEndpointsOrdered(epData, isMG9K);
  }

  postCancelDeload(line: ILineRequest) {
    return this.lineMaintenanceManagerService.cancelDeload(line);
  }

  getCMCLLI() {
    return this.networkViewService.getCMCLLI();
  }

  getMaintenance(action: string, body: ILineRequest) {
    return this.lineMaintenanceManagerService.getMaintenance(action, body);
  }

  getQdn(dn: string) {
    return this.lineMaintenanceManagerService.getQdn(dn);
  }

  getQsip(dn: string) {
    return this.lineMaintenanceManagerService.getQsip(dn);
  }

  getMiddleBoxIp(middleBoxName: string) {
    return this.gatewayControllerElementManagerService.getMiddleBoxIp(middleBoxName);
  }

  getGateWayIp(gwAddress: string, gwName: string) {
    return this.lineMaintenanceManagerService.getGateWayIp(gwAddress, gwName);
  }
}
