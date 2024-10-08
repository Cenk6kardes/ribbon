import { NgTemplateOutlet } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';

import { FieldName, FilterTypes, IPageHeader, ITableConfig, Icols, PaginatorMode } from 'rbn-common-lib';
import { CommonService } from 'src/app/services/common.service';
import { TranslateInternalService } from 'src/app/services/translate-internal.service';
import { AuditService } from '../../services/audit.service';
import { ICurrentAudit } from '../../models/audit';
import { StorageService } from 'src/app/services/storage.service';
import { tableConfigCommon } from 'src/app/types/const';
import momentTZ from 'moment-timezone';
import { AuditUtilitiesService } from '../../services/audit-utilities.service';

@Component({
  selector: 'app-current-audit',
  templateUrl: './current-audit.component.html',
  styleUrls: ['./current-audit.component.scss']
})
export class CurrentAuditComponent implements OnInit, AfterViewInit {
  @ViewChild('headerTemplate', { static: false }) elHeader: NgTemplateOutlet;
  dataCurrentAudit: ICurrentAudit[] = [];
  lastRefeshValue = '';
  isInprocess = false;
  translateResults: any;
  headerData: IPageHeader;
  currentTimeFormat = 'MM/DD/YYYY HH:mm:ss';
  userIDData = '';
  tableConfig: ITableConfig = {
    ...tableConfigCommon,
    tableOptions: {
      ...tableConfigCommon.tableOptions,
      dataKey: 'auditName'
    },
    selectedRows: [],
    tableName: 'tbCurrentAudit',
    numberRowPerPage: 5,
    rowsPerPageOptions: [5, 10, 15],
    actionColumnConfig: {
      actions: [
        {
          icon: 'fas fa-times',
          label: 'Abort',
          tooltip: 'Abort',
          onClick: (row: ICurrentAudit) => {
            this.showConfirmAbort(row);
          }
        }
      ]
    }
  };

  confirmAbortAudit: {
    title: string,
    content: string,
    isShowConfirmDialog: boolean,
    titleAccept: string,
    titleReject: string,
    data: ICurrentAudit | undefined
  } = {
      title: '',
      content: '',
      isShowConfirmDialog: false,
      titleAccept: '',
      titleReject: '',
      data: undefined
    };

  cols: Icols[] = [
    {
      field: 'auditName', header: 'Audit Name', sort: true, data: [], colsEnable: true,
      type: FilterTypes.Dropdown, options: {}, allowHide: false
    },
    {
      field: 'startTime', header: 'Start Time', sort: true, data: [], colsEnable: true, type: FilterTypes.InputText
    },
    {
      field: 'userID', header: 'UserID', sort: true, data: [], colsEnable: true, type: FilterTypes.InputText, options: {}
    },
    {
      field: 'host', header: 'Host', sort: true, data: [], colsEnable: true, type: FilterTypes.InputText, options: {}
    },
    {
      field: 'auditProcess', header: 'Audit Process', sort: true, data: [], colsEnable: true, type: FilterTypes.InputText, options: {}
    },
    {
      field: 'completionState', header: 'Completion State', sort: true, data: [], colsEnable: true, type: FilterTypes.InputText
    },
    { field: FieldName.Action, header: 'Action', sort: false, data: [], colsEnable: true, autoSetWidth: false }
  ];

  constructor(
    private translateInternalService: TranslateInternalService,
    private commonService: CommonService,
    private auditService: AuditService,
    private storageService: StorageService,
    private auditUtilitiesService: AuditUtilitiesService
  ) {
    this.translateResults = this.translateInternalService.translateResults;
  }

  ngOnInit(): void {
    this.userIDData = this.storageService.userID;
    this.lastRefeshValue = this.commonService.getCurrentTime(this.currentTimeFormat);
    this.initPageHeader();
    this.doGetRunningAudit();
  }

  ngAfterViewInit(): void {
    const newConfig = { ...this.tableConfig };
    newConfig.extensibleHeaderTemplate = this.elHeader;
    this.tableConfig = newConfig;
  }

  doRefreshDataTable() {
    this.doGetRunningAudit();
  }

  initPageHeader() {
    this.headerData = {
      title: this.translateResults.AUDIT.HEADER.CURRENT_AUDIT
    };
  }

  doAbort(event: boolean, rowData: ICurrentAudit | undefined) {
    this.confirmAbortAudit.isShowConfirmDialog = false;
    if (event && rowData) {
      this.isInprocess = true;
      this.doGetAuditState(rowData.auditName).subscribe({
        next: (rs) => {
          if (rs.completed >= 100) {
            this.commonService.showErrorMessage(
              this.translateResults.AUDIT.MESSAGE.CAN_NOT_ABORT
            );
            this.isInprocess = false;
            this.doGetRunningAudit();
            return;
          }
          this.auditService.getRunningAudit().subscribe({
            next: (res) => {
              if (res.length > 0) {
                const abortingAudit = res.find((item) => {
                  const info = item.split(';');
                  if (info[0] === rowData.auditName) {
                    return true;
                  } else {
                    return false;
                  }
                });
                if (abortingAudit) {
                  const info = abortingAudit.split(';');
                  const body = `${info[0]};${info[1].replace(/Started at:/, '')}`;
                  this.auditService.postAudit(this.userIDData, body).subscribe({
                    next: () => {
                      // need setTimeout here to get correct running Audit from API.
                      setTimeout(() => {
                        this.isInprocess = false;
                        this.commonService.showSuccessMessage(
                          this.translateResults.AUDIT.MESSAGE.AUDIT_ABORTED
                            .replace(/{{auditName}}/, rowData.auditName)
                            .replace(/{{userIDData}}/, this.userIDData)
                        );
                        this.doGetRunningAudit();
                      }, 1000);
                    },
                    error: (errorPostAudit) => {
                      this.isInprocess = false;
                      this.commonService.showAPIError(errorPostAudit);
                    }
                  });
                }
              } else {
                this.isInprocess = false;
              }
            },
            error: (errorRunningAudit) => {
              this.isInprocess = false;
              this.commonService.showAPIError(errorRunningAudit);
            }
          });
        },
        error: (errorAuditState) => {
          this.isInprocess = false;
          this.commonService.showAPIError(errorAuditState);
        }
      });
    }
  }

  doGetRunningAudit() {
    this.lastRefeshValue = this.commonService.getCurrentTime(this.currentTimeFormat);
    this.isInprocess = true;
    this.auditService.getRunningAudit().subscribe({
      next: (rs) => {
        this.isInprocess = false;
        const currentAuditTemp: ICurrentAudit[] = [];
        for (let i = 0; i < rs.length; i++) {
          const item = rs[i].split(';');
          const objectAuditRuning = {
            auditName: item[0],
            startTime: item[1].replace('Started at:', ''),
            userID: item[2].replace('UserID:', ''),
            host: item[3].replace('Host:', ''),
            auditProcess: '',
            completionState: ''
          };
          objectAuditRuning.startTime = momentTZ
            .tz(objectAuditRuning.startTime, 'YYYY-MM-DD HH:mm:ss', this.auditUtilitiesService.timeZoneName)
            .format(this.auditUtilitiesService.timeFormat);
          currentAuditTemp.push(objectAuditRuning);
        }
        this.dataCurrentAudit = currentAuditTemp;
        for (let i = 0; i < this.dataCurrentAudit.length; i++) {
          const itemCurrentAudit = this.dataCurrentAudit[i];
          this.doGetAuditState(itemCurrentAudit.auditName).subscribe({
            next: (rsAuditState) => {
              itemCurrentAudit.auditProcess = rsAuditState.auditProcess;
              itemCurrentAudit.completionState = rsAuditState.completed + '%';
            },
            error: () => {
              itemCurrentAudit.auditProcess = '';
              itemCurrentAudit.completionState = '';
            }
          });
        }
      },
      error: (errorRunningAudit) => {
        this.isInprocess = false;
        this.commonService.showAPIError(errorRunningAudit);
      }
    });
  }

  doGetAuditState(auditName: string) {
    return this.auditService.getAuditState(auditName);
  }

  showConfirmAbort(row: ICurrentAudit) {
    this.confirmAbortAudit.title = this.translateResults.AUDIT.HEADER.ABORT_AUDIT;
    this.confirmAbortAudit.content = this.translateResults.AUDIT.MESSAGE.CONFIRM_ABORT_AUDIT
      .replace(/{{auditName}}/, row.auditName);
    this.confirmAbortAudit.titleAccept = this.translateResults.COMMON.YES;
    this.confirmAbortAudit.titleReject = this.translateResults.COMMON.NO;
    this.confirmAbortAudit.data = row;
    this.confirmAbortAudit.isShowConfirmDialog = true;
  }
}
