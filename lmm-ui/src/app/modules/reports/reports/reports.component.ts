import { Component, OnInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';

import { FilterTypes, Icols, IPageHeader, ITableConfig, TableComponent } from 'rbn-common-lib';

import { IReportsList, REPORT_TYPE } from '../../../shared/models/line-maintenance-manager';
import { PREFIX_URL, tableConfigCommon, topDropdownItems } from 'src/app/types/const';

import { TranslateInternalService } from 'src/app/services/translate-internal.service';
import { CommonService } from 'src/app/services/common.service';
import { ReportService } from '../services/reports.service';
import { interval, Subscription } from 'rxjs';
import moment from 'moment';
@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit, OnDestroy {
  @ViewChild('progressBarTemp', { static: true }) progressBarTemp: TemplateRef<any>;
  @ViewChild('rbnTable', { static: true }) reportTable: TableComponent;
  tableConfig: ITableConfig;
  headerData: IPageHeader;
  cols: Icols[] = [];
  data: IReportsList[] = [];
  translateResults: any;
  isLoading = false;
  topDropdownData = '';
  subscriptionQueryProgress$: Subscription;
  progressValue: number;

  constructor(
    private translateService: TranslateInternalService,
    private reportService: ReportService,
    private commonService: CommonService,
    private router: Router
  ) {
    this.translateResults = this.translateService.translateResults;
    this.tableConfig = {
      ...tableConfigCommon,
      tableOptions: {
        dataKey: 'fileDisplay',
        hideTableButtons: false,
        hideCheckboxAll: false,
        hideColumnInLib: true,
        show3DotsButton: true,
        btn3DotsConfig: {
          exportCSVByLib: true
        }
      },
      tableName: 'ReportTbl',
      enableFilter: false
    };
  }

  ngOnInit(): void {
    this.initPageHeader();
    this.initCols();
    this.getListOfReport();
  }

  initPageHeader() {
    this.headerData = {
      title: this.translateResults.REPORTS_SCREEN.REPORTS_TITLE,
      topDropdown: {
        isDisplay: true,
        content: [
          {
            value: '', label: this.translateResults.REPORTS_SCREEN.REPORTS_ACTIONS
          },
          {
            value: topDropdownItems.CreateOnDemandReport, label: this.translateResults.REPORTS_SCREEN.CREATE_ON_DEMAND_REPORT_TITLE
          },
          {
            value: topDropdownItems.ReportsSchedulingOptions, label: this.translateResults.REPORTS_SCREEN.REPORTS_SCHEDULING_OPTIONS
          }]
      }
    };
  }

  initCols() {
    this.cols = [
      {
        data: [], field: 'fileDisplay', header: this.translateResults.REPORTS_SCREEN.REPORTS_NAME,
        colsEnable: true, options: { model: '', usingLink: true }, sort: false, type: FilterTypes.InputText, autoSetWidth: true
      },
      {
        data: [], field: 'fileLMTimeInMillis', header: this.translateResults.REPORTS_SCREEN.DATE_CREATE, colsEnable: true, sort: false,
        type: FilterTypes.Calendar, autoSetWidth: true
      },
      {
        data: [], field: 'scheduledText', header: this.translateResults.REPORTS_SCREEN.TYPE, colsEnable: true, sort: false,
        type: FilterTypes.Dropdown, autoSetWidth: true
      }
    ];
  }

  getListOfReport(loading = true) {
    this.isLoading = loading;
    this.reportService.getListOfReport().subscribe(res => {
      this.data = res;
      this.isLoading = false;
      this.handleQueryProgress();
    }, err => {
      this.isLoading = false;
      this.commonService.showAPIError(err);
    });
  }

  onLinkClick(row: IReportsList) {
    if (row) {
      const queryParams = {
        reportType: row.fileName
      };
      this.router.navigate([PREFIX_URL + '/reports/detail', row.fileDisplay], { queryParams });
    }
  }

  refreshTable() {
    this.stopRunningQueryProcess();
    this.getListOfReport();
  }

  selectedDropItem(value: string) {
    this.topDropdownData = value;
    switch (value) {
      case topDropdownItems.CreateOnDemandReport:
        this.router.navigate([PREFIX_URL + '/reports/createDemandReport']);
        break;
      case topDropdownItems.ReportsSchedulingOptions:
        this.router.navigate([PREFIX_URL + '/reports/reportSchedulingOptions']);
        break;
    }
  }

  handleQueryProgress() {
    if (this.reportService.runQueryProgress) {
      this.progressValue = 0;
      const newReport: IReportsList = {
        fileDisplay: '',
        fileName: '',
        scheduled: false,
        scheduledText: REPORT_TYPE.ON_DEMAND,
        fileLMTimeInMillisPreHtml: this.progressBarTemp
      };
      this.data = [ newReport, ...this.data ];
      setTimeout(() => {
        this.handleDisabledNewReportLink();
      });
      this.subscriptionQueryProgress$ = interval(5000).subscribe(() => {
        this.reportService.getQueryProgress('all').subscribe(value => {
          if (value > 0) {
            const time = parseInt((value * 100 * 100 / 6400).toString(), 10);
            const percentage = parseFloat((time / 100).toString());
            this.progressValue = percentage;
            if (this.progressValue === 100) {
              this.getListOfReport(false);
              this.stopRunningQueryProcess();
              this.commonService.showSuccessMessage(this.translateResults.REPORTS_SCREEN.CREATE_REPORT_SUCCESS);
            }
          }
        }, err => {
          this.data = [ ...this.data.slice(1) ];
          this.commonService.showAPIError(err);
          this.stopRunningQueryProcess();
        });
      });
    }
  }

  getReportName() {
    const currentDate = moment().format('YYYY-MM-DD-HH-mm-ss');
    const timeZone = 'GMT' + moment().format('Z').split(':').join('');
    let reportName = this.translateResults.REPORTS_SCREEN.REPORT_NAME_FORMAT;
    reportName = reportName?.replace('{{DATE}}', currentDate)?.replace('{{TIME_ZONE}}', timeZone);
    return reportName;
  }

  stopRunningQueryProcess() {
    this.subscriptionQueryProgress$?.unsubscribe();
    this.reportService.runQueryProgress = false;
    this.handleDisabledNewReportLink(false);
  }

  handleDisabledNewReportLink(disabled = true) {
    const link = this.reportTable.elementRef?.nativeElement?.querySelector('tbody td .link');
    if (link) {
      link.style.pointerEvents = disabled ? 'none' : 'all';
      link.style.opacity = disabled ? 0.5 : 1;
    }
  }

  ngOnDestroy(): void {
    this.stopRunningQueryProcess();
  }
}
