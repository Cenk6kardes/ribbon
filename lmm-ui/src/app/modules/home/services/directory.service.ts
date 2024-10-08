import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { ILineRequest } from 'src/app/shared/models/line-maintenance-manager';
import { EDirectoryValue, IDirectoryPostForm, IDirectoryTable } from '../models/home';

import { StorageService } from '../../../services/storage.service';
import { StatusLogService } from 'src/app/services/status-log.service';
import { CommonService } from 'src/app/services/common.service';

@Injectable({
  providedIn: 'root'
})
export class DirectoryService {
  private tableData: IDirectoryTable[] = [];
  public dataTableChange$ = new Subject<boolean>();


  constructor(
    private storageService: StorageService,
    private statusLogService: StatusLogService,
    private commonService: CommonService
  ) { }

  set dataTable(data: IDirectoryTable[]) {
    this.tableData = data;
    this.dataTableChange$.next(true);
  }

  get dataTable(): IDirectoryTable[] {
    return this.tableData;
  }

  storeDataTableStorage(data: IDirectoryTable[]) {
    this.storageService.tableDNData = data ? data : this.dataTable;
  }

  restoreDataTableFromStorage() {
    this.dataTable = this.storageService.tableDNData;
    this.storageService.tableDNData = [];
  }

  setPostCommandDataToStorage(data: IDirectoryPostForm[]) {
    this.storageService.postCommandData = data;
  }

  getPostCommandDataFromStorage() {
    return this.storageService.postCommandData;
  }

  getRowIndexByCMDN(cm_dn: string) {
    return this.dataTable.findIndex(n => n.cm_dn === cm_dn);
  }

  /**
   * If DN does not exist, push it into dataTable else update row data
   * @param rowsData IDirectoryTable
   */
  handleRowData(rowsData: IDirectoryTable, indexCM_DN?: number) {
    if (indexCM_DN === undefined) {
      indexCM_DN = this.getRowIndexByCMDN(rowsData.cm_dn);
    }
    if (indexCM_DN === -1) {
      this.dataTable = [...this.dataTable, rowsData];
      // TODO - Need to re-check after Status Logs document is ready
      this.statusLogService.pushLogs(`DN ${rowsData.cm_dn} is posted`);
    } else {
      this.dataTable[indexCM_DN] = rowsData;
      // to trigger ngOnchanges
      this.dataTable = [...this.dataTable];
    }
  }

  handleRowWhenCMRCInvalid(cm_dn: string) {
    const row = this.dataTable.find(n => n.cm_dn === cm_dn);
    if (row) {
      row.cm_line_state = EDirectoryValue.NOT_AVAILABLE;
      row.endpoint_state = EDirectoryValue.NOT_AVAILABLE;
      row.time = this.commonService.getCurrentTime();
      // to trigger ngOnchange
      this.dataTable = [...this.dataTable];
    }
  }

  deleteRowWhenCMRC_2(cm_dn: string){
    const row = this.getRowIndexByCMDN(cm_dn);
    if(row !== -1){
      this.dataTable.splice(row,1);
      // to trigger ngOnchange
      this.dataTable = [...this.dataTable];
    }
  }

  /**
   * Combined epState, epCallState, epTerminalType and set as the value for "Endpoint State" field in the table
   * @param endpointStateRs any
   * @returns string
   */
  formatEndpointStateValue(endpointStateRs: any): string {
    let endpointState = '';
    if (endpointStateRs) {
      endpointState = endpointStateRs.epState + ', '
        + endpointStateRs.epCallState + ', '
        + endpointStateRs.epTerminalType;
    }
    return endpointState;
  }

  formatLineRequest(lineData: any): ILineRequest {
    return {
      cm_clli: lineData?.clli || this.storageService.clli,
      cm_tid: lineData?.cm_dn,
      gw_name: lineData?.gw_name,
      gw_address: lineData?.gw_address,
      endpoint_name: lineData?.endpoint_name
    };
  }
}
