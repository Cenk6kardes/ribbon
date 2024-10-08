import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CmtgRestService } from 'src/app/services/api/cmtg-rest.service';
import { environment } from 'src/environments/environment';
import {
  IGranularAuditData, IAuditState, IGranularLineTree, INodeNameNumber,
  IAuditConfig, IReportList, IAuditReport, IAuditReportMap, EStatusTextReport,
  IResDeleteMgUIName
} from '../models/audit';
import { map } from 'rxjs/operators';
import * as pako from 'pako';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuditService {
  apiPathAudit = environment.host + '/AuditApi/audit/v1.0';
  apiPathGwcem = environment.host + '/GwcemApi/gwcem/v1.0';
  apiPathCs2kcfg = environment.host + '/cs2kcfgApi/cs2kcfg/v1.0';

  constructor(private cmtgRestService: CmtgRestService) { }

  getRegisteredAudit(): Observable<Array<string>> {
    return this.cmtgRestService.getDataBody(`${this.apiPathAudit}/registered-audit-list`);
  }

  getDescription(auditName: string): Observable<Array<string>> {
    return this.cmtgRestService.getStringDataBody(`${this.apiPathAudit}/audit-description/${auditName}`);
  }

  putAudit(auditName: string, userID: string, host: string, dataBody: IGranularAuditData): Observable<any> {
    const params = new HttpParams();
    return this.cmtgRestService.putDataParamBody(`${this.apiPathAudit}/audit/${auditName}/${userID}/${host}`, params, dataBody);
  }

  postAudit(userID: string, body: string): Observable<any> {
    return this.cmtgRestService.postDataBody(`${this.apiPathAudit}/audit/${userID}`, body);
  }

  getNodeNameNumber(): Observable<INodeNameNumber> {
    return this.cmtgRestService.getDataBody(`${this.apiPathGwcem}/node-name-number`);
  }

  getGranularLineTree(): Observable<IGranularLineTree[]> {
    return this.cmtgRestService.getDataBody(`${this.apiPathGwcem}/granular-line-tree`);
  }

  getRunningAudit(): Observable<Array<string>> {
    return this.cmtgRestService.getDataBody(`${this.apiPathAudit}/running-audit`);
  }

  getPreparationForAudit(auditName: string): Observable<string | boolean> {
    return this.cmtgRestService.getDataBody(`${this.apiPathAudit}/preparation-for-audit/${auditName}`);
  }

  getAuditState(auditName: string): Observable<IAuditState> {
    return this.cmtgRestService.getDataBody(`${this.apiPathAudit}/audit-state/${auditName}`);
  }

  postAuditConfiguration(auditName: string, dataBody: IAuditConfig): Observable<any> {
    return this.cmtgRestService.postDataBody(`${this.apiPathAudit}/audit-configuration/${auditName}`, dataBody);
  }

  getAuditConfiguration(auditName: string): Observable<{ auditType: string, data: IAuditConfig }> {
    return this.cmtgRestService.getDataBody(`${this.apiPathAudit}/audit-configuration/${auditName}`).pipe(
      map((rs) => ({ auditType: auditName, data: rs }))
    );
  }

  getSessionServerConnected(): Observable<string | boolean> {
    return this.cmtgRestService.getStringDataBody(`${this.apiPathGwcem}/session-server-connected`);
  }

  getReportList(auditName: string): Observable<IReportList[]> {
    return this.cmtgRestService.getDataBody(`${this.apiPathAudit}/report-list/${auditName}`);
  }

  getReportListWithPort(auditName: string): Observable<IReportList[]> {
    return this.cmtgRestService.getDataBody(`${this.apiPathAudit}/report-list-with-port/${auditName}`);
  }

  getReportListByCheckAuditTakeActions(isReportsAuditTakeActions: boolean, auditName: string): Observable<IReportList[]> {
    if (isReportsAuditTakeActions) {
      return this.getReportList(auditName);
    } else {
      return this.getReportListWithPort(auditName);
    }
  }

  getReportFileContent(urlGZ: string): Observable<string> {
    return this.cmtgRestService.getArrayBuffer(urlGZ).pipe(map((gzipContentArrayBuffer) => {
      const inflated = pako.inflate(gzipContentArrayBuffer, { to: 'string' });
      return inflated;
    }));
  }

  getAuditReport(auditName: string): Observable<IAuditReportMap[]> {
    return this.cmtgRestService.getDataBody(`${this.apiPathAudit}/audit-report/${auditName}`).pipe(map((itemReports: IAuditReport[]) => {
      const reportsCustom: IAuditReportMap[] = [];
      itemReports.map((item, index) => {
        const tempItem: any = { ...item, index: '0', statusText: '' };
        tempItem.index = index;
        tempItem.problemID = item.problemID;
        switch (item.status.__value) {
          case 0: {
            tempItem.statusText = EStatusTextReport.PROBLEM_EXISTS;
          }
            break;
          case 1: {
            tempItem.statusText = EStatusTextReport.PROBLEM_CORRECTED;
          }
            break;
          case 2: {
            tempItem.statusText = EStatusTextReport.CORRECTION_FAILED;
          }
            break;
          default: {
            tempItem.statusText = EStatusTextReport.UNKNOWN;
          }
            break;
        }
        reportsCustom.push(tempItem);
      });
      return reportsCustom;
    }));
  }

  getlastRunTime(auditName: string): Observable<string> {
    return this.cmtgRestService.getStringDataBody(`${this.apiPathAudit}/last-run-time/${auditName}`);
  }

  postActionProblem(auditName: string, problemID: number, correctiveAction: number, dataBody: string): Observable<string> {
    return this.cmtgRestService.postDataBody(`${this.apiPathAudit}/action-problem/${auditName}/${problemID}/${correctiveAction}`, dataBody);
  }

  getLastRunScheduled(auditName: string): Observable<string> {
    return this.cmtgRestService.getStringDataBody(`${this.apiPathAudit}/last-run-scheduled-audit/${auditName}`);
  }

  isV52Supported(): Observable<string | boolean> {
    return this.cmtgRestService.getDataBody(`${this.apiPathGwcem}/is-v52-supported`);
  }

  deleteMgUIName(mgUIName: string): Observable<IResDeleteMgUIName> {
    return this.cmtgRestService.deleteDataBody(`${this.apiPathCs2kcfg}/mg/${mgUIName}/180`);
  }

  getAuditTimezone(): Observable<string> {
    return this.cmtgRestService.getStringDataBody(`${this.apiPathAudit}/time-zone`);
  }
}
