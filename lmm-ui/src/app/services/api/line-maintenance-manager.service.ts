import { Injectable } from '@angular/core';
import { HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { LmmRestService } from './lmm-rest.service';
import {
  IDetailedReport,
  IGatewayEndpointInfo,
  IGeneralReport,
  ILinePostResponseInfo,
  ILineRequest,
  ILineValidateResponseInfo,
  IQueryConfiguration,
  IReportsList,
  IResponseStatus,
  ILineMtcResponseInfo,
  IQueryDirectoryNumberResponse
} from 'src/app/shared/models/line-maintenance-manager';
@Injectable({
  providedIn: 'root'
})
export class LineMaintenanceManagerService {
  apiPath = environment.host + '/LmmApi/lmm/v1.0';

  constructor(private restService: LmmRestService) { }

  // Get Line Information with DN and CLLI
  getLineInformationByDNAndCLLI(dn: string, clli: string): Observable<ILineValidateResponseInfo> {
    return this.restService.getDataBody(`${this.apiPath}/line-validation/${dn}/${clli}`);
  }

  // Get line Post Information
  getLinePostInformation(line: ILineRequest): Observable<ILinePostResponseInfo> {
    return this.restService.postDataBody(`${this.apiPath}/line-information`, line);
  }

  // Endpoint state information
  getEndpointStateInformation(gwc_address: string, cm_tid: string): Observable<IGatewayEndpointInfo> {
    const cm_tidSplit = cm_tid.split('.');
    const nodeNumber = cm_tidSplit[0];
    const terminalNumber = cm_tidSplit[2];
    return this.restService.getDataBody(`${this.apiPath}/endpoint-state/${gwc_address}/${nodeNumber}/${terminalNumber}`);
  }

  // Get CBMG IP
  getCBMgIP(): Observable<string> {
    return this.restService.getStringDataBody(`${this.apiPath}/sdm-ip`);
  }

  // Get CM CLLI information
  getCLLI(cBMgIP: string): Observable<string> {
    return this.restService.getStringDataBody(`${this.apiPath}/cm-clli/${cBMgIP}`);
  }

  // Get list of reports
  getListOfReport(): Observable<IReportsList[]> {
    const queryName = 'all';
    const url = `${this.apiPath}/report-list/${queryName}`;
    return this.restService.getDataBody(url);
  }

  // Retrieve General Result of report
  getGeneralResultOfReport(reportName: string): Observable<IGeneralReport[]> {
    const url = `${this.apiPath}/general-report/${reportName}`;
    return this.restService.getDataBody(url);
  }

  // Retrieves detailed query report for Gateway Controller
  getDetailedReport(pathParameters: any): Observable<IDetailedReport[]> {
    const url = `${this.apiPath}/detailed-report/${pathParameters?.reportName}/${pathParameters?.gwcName}`;
    return this.restService.getDataBody(url);
  }

  // Run trouble query for gateways
  postTroubleQueryGWControllers(data: string[]): Observable<any> {
    const url = `${this.apiPath}/trouble-gw-query`;
    return this.restService.postDataBody(url, data);
  }

  // Run trouble query for all gateway controllers
  postTroubleQueryAllGWControllers(): Observable<any> {
    const queryName = 'all';
    const url = `${this.apiPath}/trouble-gw-query/${queryName}`;
    return this.restService.postDataBody(url);
  }

  // Get Line Information with TID and CLLI
  getLineInformationByTIDAndCLLI(tid: string, clli: string): Observable<ILineValidateResponseInfo> {
    return this.restService.getDataBody(`${this.apiPath}/line-validation-tid/${tid}/${clli}`);
  }

  // Cancel deload posted line
  cancelDeload(line: ILineRequest): Observable<HttpResponse<any>> {
    return this.restService.post(`${this.apiPath}/deload-cancellation`, line);
  }

  // Retrieve query configuration
  getQueryConfiguration(): Observable<IQueryConfiguration[]> {
    const query = 'all';
    const url = `${this.apiPath}/query-configuration/${query}`;
    return this.restService.getDataBody(url);
  }

  // Configure Query
  runQueryConfiguration(requestBody: IQueryConfiguration): Observable<HttpResponse<Object>> {
    const url = `${this.apiPath}/query-configuration`;
    return this.restService.put(url, requestBody);
  }

  getMaintenance(action: string, body: ILineRequest): Observable<ILineMtcResponseInfo> {
    const requestParams = new HttpParams().set('action', action);
    return this.restService.putDataParamBody(`${this.apiPath}/maintenance`, requestParams, body);
  }

  getQdn(dn: string): Observable<IQueryDirectoryNumberResponse> {
    return this.restService.getStringDataBody(`${this.apiPath}/qdn/${dn}`);
  }

  getQsip(dn: string): Observable<ILineValidateResponseInfo> {
    return this.restService.getStringDataBody(`${this.apiPath}/qsip/${dn}`);
  }

  // Query Progress of Trouble Gateway Report
  getQueryProgress(step: string): Observable<any> {
    return this.restService.getStringDataBody(`${this.apiPath}/query-progress/${step}`);
  }

  // Properties bulk action gateway call
  getGateWayIp(gwAddress: string, gwName: string): Observable<string> {
    return this.restService.getStringDataBody(`${this.apiPath}/gw-ip/${gwAddress}/${gwName}`);
  }
}
