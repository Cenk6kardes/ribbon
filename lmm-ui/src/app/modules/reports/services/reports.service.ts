import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import { GatewayControllerElementManagerService } from 'src/app/services/api/gateway-controller-element-manager.service';
import { LineMaintenanceManagerService } from 'src/app/services/api/line-maintenance-manager.service';
import { IQueryConfiguration, REPORT_TYPE } from 'src/app/shared/models/line-maintenance-manager';

@Injectable({
  providedIn: 'root'
})

export class ReportService {
  runQueryProgress = false;

  constructor(
    private lineMaintenanceManagerService: LineMaintenanceManagerService,
    private gatewayControllerElementManagerService: GatewayControllerElementManagerService
  ) { }

  getListOfReport() {
    return this.lineMaintenanceManagerService.getListOfReport().pipe(map((res)=>{
      res.map((item)=>{
        item.scheduledText = item.scheduled ? REPORT_TYPE.SCHEDULED : REPORT_TYPE.ON_DEMAND;
      });
      return res;
    }));
  }

  getGeneralResultOfReport(reportName: string) {
    return this.lineMaintenanceManagerService.getGeneralResultOfReport(reportName);
  }

  getDetailedReport(pathParameters: any) {
    return this.lineMaintenanceManagerService.getDetailedReport(pathParameters);
  }

  getLMMLineGatewayNames(gwName: string) {
    return this.gatewayControllerElementManagerService.getLMMLineGatewayNames(gwName);
  }

  getGatewayControllersList() {
    return this.gatewayControllerElementManagerService.getGWCList();
  }

  postTroubleQueryGWControllers(data: string[]) {
    return this.lineMaintenanceManagerService.postTroubleQueryGWControllers(data);
  }

  postTroubleQueryAllGWControllers() {
    return this.lineMaintenanceManagerService.postTroubleQueryAllGWControllers();
  }

  getQueryConfiguration() {
    return this.lineMaintenanceManagerService.getQueryConfiguration();
  }

  runQueryConfiguration(requestBody: IQueryConfiguration) {
    return this.lineMaintenanceManagerService.runQueryConfiguration(requestBody);
  }

  getQueryProgress(step: string) {
    return this.lineMaintenanceManagerService.getQueryProgress(step);
  }
}
