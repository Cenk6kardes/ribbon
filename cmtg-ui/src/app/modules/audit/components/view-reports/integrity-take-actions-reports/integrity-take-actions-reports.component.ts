import { NgTemplateOutlet } from '@angular/common';
import {
  AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input,
  OnChanges, Output, SimpleChanges, TemplateRef, ViewChild
} from '@angular/core';
import { Dropdown } from 'primeng/dropdown';
import {
  ITableConfig, rowExpandMode, FieldName, FilterTypes, Icols
} from 'rbn-common-lib';
import { AuditService } from '../../../services/audit.service';
import { EDataIntegrity, IAuditReportMap } from '../../../models/audit';
import { CommonService } from 'src/app/services/common.service';
import { TranslateInternalService } from 'src/app/services/translate-internal.service';
import { tableConfigCommon } from 'src/app/types/const';
import momentTZ from 'moment-timezone';
import { AuditUtilitiesService } from '../../../services/audit-utilities.service';

@Component({
  selector: 'app-integrity-take-actions-reports',
  templateUrl: './integrity-take-actions-reports.component.html',
  styleUrls: ['./integrity-take-actions-reports.component.scss']
})
export class IntegrityTakeActionsReportsComponent implements AfterViewInit, OnChanges {

  @ViewChild('possibleActionsTemplate', { static: false }) possibleActionsTemplate: TemplateRef<any>;
  @ViewChild('headerTemplate', { static: false }) elHeader: NgTemplateOutlet;
  @Input() auditName = '';
  @Output() eventShowLoading = new EventEmitter();
  dataReports: IAuditReportMap[] = [];
  lastAuditDateValue = '';
  translateResults: any;

  rowExpansionTpl: TemplateRef<any>;
  tableConfig: ITableConfig = {
    ...tableConfigCommon,
    tableOptions: {
      ...tableConfigCommon.tableOptions,
      dataKey: 'index',
      rowExpandMode: rowExpandMode.Multiple,
      show3DotsButton: true,
      btn3DotsConfig: {
        exportCSVByLib: true,
        exportPDFByLib: true
      }
    },
    selectedRows: [],
    tableName: 'tbC20DataIntegrityReports',
    numberRowPerPage: 5,
    rowsPerPageOptions: [5, 10, 15],
    isSupportGrouping: true
  };

  cols: Icols[] = [
    { field: FieldName.Expand, header: '', sort: false, data: [], colsEnable: true },
    { field: 'index', header: 'Index', sort: true, data: [], colsEnable: true, type: FilterTypes.InputText, options: {} },
    {
      field: 'problemDescription', header: 'Problem Description', sort: false, data: [], colsEnable: true, type: FilterTypes.InputText
    },
    {
      field: 'statusText', header: 'Status', sort: true, data: [], colsEnable: true, type: FilterTypes.InputText, options: {},
      allowHide: false
    }
  ];

  constructor(
    private cdr: ChangeDetectorRef,
    private auditService: AuditService,
    private commonService: CommonService,
    private translateInternalService: TranslateInternalService,
    private auditUtilitiesService: AuditUtilitiesService
  ) {
    this.translateResults = this.translateInternalService.translateResults;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['auditName'] && this.auditName) {
      this.doGetAuditReport();
    }
  }

  ngAfterViewInit(): void {
    this.rowExpansionTpl = this.possibleActionsTemplate;
    this.cdr.detectChanges();
    const newConfig = { ...this.tableConfig };
    newConfig.extensibleHeaderTemplate = this.elHeader;
    this.tableConfig = newConfig;
  }

  doTakeAction(fieldPossibleActions: Dropdown, rowdata: IAuditReportMap) {
    if (this.auditName === EDataIntegrity.SMALL_LINE_DATA_INTEGRITY_AUDIT) {
      const problemDescription = rowdata.problemDescription;
      const gatewayName = this.getGatewayNameFromString(problemDescription);
      if (gatewayName) {
        this.auditService.deleteMgUIName(gatewayName).subscribe({
          next: (rs) => {
            if (rs.rc.__value === 0) {
              this.commonService.showSuccessMessage(
                this.translateResults.AUDIT.MESSAGE.ACTION_SUCCESSFULLY
                  .replace(/{{actionName}}/, fieldPossibleActions.selectedOption.correctiveTitle)
              );
            } else {
              this.commonService.showErrorMessage(rs.responseMsg);
            }
          },
          error: (error) => {
            this.commonService.showAPIError(error);
          }
        });
      } else {
        this.commonService.showErrorMessage(this.translateResults.AUDIT.MESSAGE.NOT_FOUND_GATEWAY_NAME);
      }
      return;
    }

    // take action
    if (this.auditName && rowdata && fieldPossibleActions.selectedOption && this.lastAuditDateValue) {
      const bodyData = this.lastAuditDateValue.split(' GMT')[0];
      this.eventShowLoading.emit(true);
      this.auditService.postActionProblem(
        this.auditName, Number(rowdata.problemID),
        fieldPossibleActions.selectedOption.correctiveAction,
        bodyData
      ).subscribe({
        next: () => {
          this.eventShowLoading.emit(false);
          this.commonService.showSuccessMessage(
            this.translateResults.AUDIT.MESSAGE.ACTION_SUCCESSFULLY
              .replace(/{{actionName}}/, fieldPossibleActions.selectedOption.correctiveTitle)
          );
          this.doGetAuditReport();
        },
        error: (error) => {
          this.eventShowLoading.emit(false);
          this.commonService.showAPIError(error);
          this.doGetAuditReport();
        }
      });
    }
  }

  getStringBetweenWorks(startStrOrigin: string, endStrOrigin: string, strOrigin: string) {
    const startStr = startStrOrigin.toLocaleLowerCase();
    const endStr = endStrOrigin.toLocaleLowerCase();
    const str = strOrigin.toLocaleLowerCase();

    const regexStartStr = new RegExp('\\b' + startStr + '\\b');
    const indexOfStart = str.search(regexStartStr);
    if (indexOfStart === -1) {
      return '';
    }
    const posStart = indexOfStart + startStr.length;
    const regexEndStr = new RegExp('\\b' + endStr + '\\b');
    const strSub = str.substring(posStart);
    const indexOfStartNext = strSub.search(regexEndStr);
    if (indexOfStartNext === -1) {
      return '';
    }
    return strSub.substring(0, indexOfStartNext);
  }

  getGatewayNameFromString(problemDescription: string) {
    // ProblemDescription will always starts with "The gateway". the gateway name is: between the Gateway and in
    let gatewayNameTemp = this.getStringBetweenWorks('The gateway', 'in', problemDescription).trim();
    if (gatewayNameTemp[gatewayNameTemp.length - 1] === '\'') {
      gatewayNameTemp = gatewayNameTemp.substring(0, gatewayNameTemp.length - 1);
    }
    return gatewayNameTemp;
  }

  doGetAuditReport() {
    this.getlastRunTime();
    this.eventShowLoading.emit(true);
    this.auditService.getAuditReport(this.auditName).subscribe({
      next: (res) => {
        this.eventShowLoading.emit(false);
        res.map((itemReport) => {
          if (itemReport.possibleActions && itemReport.possibleActions.length > 0) {
            itemReport.children = [];
          } else {
            delete itemReport.children;
          }
        });
        this.dataReports = res;
      },
      error: (errorViewReport) => {
        this.eventShowLoading.emit(false);
        this.commonService.showAPIError(errorViewReport);
      }
    });
  }

  getlastRunTime() {
    this.auditService.getlastRunTime(this.auditName).subscribe({
      next: (rs) => {
        this.lastAuditDateValue = momentTZ
          .tz(rs, 'YYYY-MM-DD HH:mm:ss', this.auditUtilitiesService.timeZoneName)
          .format(this.auditUtilitiesService.timeFormat);
      },
      error: (errorLastRunTime) => {
        this.commonService.showAPIError(errorLastRunTime);
      }
    });
  }

  doRefreshDataTable() {
    this.doGetAuditReport();
  }

}
