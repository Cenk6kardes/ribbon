import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { FieldName, FilterTypes, Icols, IPageHeader, ITableConfig, ItemDropdown, TableComponent } from 'rbn-common-lib';
import { CommonService } from 'src/app/services/common.service';

import { TranslateInternalService } from 'src/app/services/translate-internal.service';
import { IDetailedReport, IGeneralReport } from 'src/app/shared/models/line-maintenance-manager';
import { PREFIX_URL, tableConfigCommon } from 'src/app/types/const';
import { ReportService } from '../../services/reports.service';
@Component({
  selector: 'app-view-report',
  templateUrl: './view-report.component.html',
  styleUrls: ['./view-report.component.scss']
})
export class ViewReportComponent implements OnInit {

  @ViewChild('dropdownHeader', { static: false }) elDropdownHeader: any;
  @ViewChild('rbnTable', { static: false }) rbnTable: TableComponent;

  headerData: IPageHeader;
  translateResults: any;
  isLoading = false;
  urlParams: any;

  // parent table
  parentTableConfig: ITableConfig;
  parentTableData: IGeneralReport[] = [];
  parentTableCols: Icols[] = [];

  // children table
  childTableData: IDetailedReport[] = [];
  childTableCols: Icols[] = [];
  childTableConfig: ITableConfig;
  isChildTable = false;
  notFoundGateway = false;
  dialogTitle = '';
  pathParameters: any = {};
  selectedReportType = '';

  constructor(
    private translateService: TranslateInternalService,
    private reportService: ReportService,
    private route: ActivatedRoute,
    private router: Router,
    private commonService: CommonService
  ) {
    this.translateResults = this.translateService.translateResults;
  }

  ngOnInit(): void {
    this.initTableConfig();
    this.urlParams = this.route.snapshot?.params || {};
    this.headerData = {
      title: this.urlParams?.reportName,
      breadcrumb: [{
        label: this.translateResults.REPORTS_SCREEN.REPORTS_TITLE,
        command: () => {
          this.onBack();
        }
      },
      { label: this.urlParams?.reportName }
      ]
    };
    this.initCols();
    this.route.queryParams.subscribe(params => {
      this.selectedReportType = params['reportType'];
      this.getGeneralResultOfReport();
    });
  }

  initTableConfig() {
    this.parentTableConfig = {
      ...tableConfigCommon,
      tableOptions: {
        dataKey: 'gwcName',
        hideTableButtons: false,
        hideCheckboxAll: false,
        hideColumnInLib: true
      },
      tableName: 'GenaralReportTbl'
    };
    this.childTableConfig = {
      ...tableConfigCommon,
      tableOptions: {
        dataKey: 'gwName',
        hideTableButtons: false,
        hideCheckboxAll: false,
        hideColumnInLib: true
      },
      tableName: 'DetailedReportTbl',
      isUsingAppendTo: false,
      actionColumnConfig: {
        actions: [
          {
            icon: 'fa fa-arrow-circle-right',
            label: this.translateResults.REPORTS_SCREEN.POST_ACTION,
            tooltip: this.translateResults.REPORTS_SCREEN.POST_ACTION,
            onClick: (item: any) => {
              this.postGateway(item);
            }
          }
        ]
      }
    };
  }

  initCols() {
    if (this.isChildTable) {
      this.childTableCols = [
        {
          data: [], field: 'gwName', header: this.translateResults.REPORTS_SCREEN.GATEWAY_NAME,
          colsEnable: true, sort: true, type: FilterTypes.Dropdown, autoSetWidth: true
        },
        {
          data: [], field: 'errorMessage', header: this.translateResults.REPORTS_SCREEN.TROUBLE_STATE_INFORMATION,
          colsEnable: true, sort: true, type: FilterTypes.Dropdown, autoSetWidth: true
        },
        {
          field: FieldName.Action, header: this.translateResults.COMMON.ACTION, sort: false, data: [], colsEnable: true,
          autoSetWidth: false
        }
      ];
    } else {
      this.parentTableCols = [
        {
          data: [], field: 'gwcName', header: this.translateResults.REPORTS_SCREEN.GATEWAY_CONTROLLER_NAME,
          colsEnable: true, options: { model: '', usingLink: true }, sort: true, type: FilterTypes.InputText, autoSetWidth: true
        },
        {
          data: [], field: 'queryResult', header: this.translateResults.REPORTS_SCREEN.QUERY_RESULT,
          colsEnable: true, sort: true, type: FilterTypes.Dropdown, autoSetWidth: true
        },
        {
          data: [], field: 'numberOfGW', header: this.translateResults.REPORTS_SCREEN.NUMBER_OF_GATEWAYS,
          colsEnable: true, options: { model: '', usingLink: true }, sort: true, type: FilterTypes.InputText, autoSetWidth: true
        }
      ];
    }
  }

  onBack() {
    this.rbnTable.removeItemStorage();
    this.router.navigate([PREFIX_URL + '/reports']);
  }

  // generate result of report in the parent table
  getGeneralResultOfReport() {
    this.isLoading = true;
    this.reportService.getGeneralResultOfReport(this.selectedReportType).subscribe(res => {
      this.parentTableData = res;
      this.isLoading = false;
    }, error => {
      this.isLoading = false;
      this.commonService.showAPIError(error);
    });
  }

  onLinkClick(row: IGeneralReport) {
    this.isChildTable = true;
    this.dialogTitle = this.translateResults.REPORTS_SCREEN.GATEWAY_DETAIL_DIALOG_TITLE;
    this.pathParameters = {
      reportName: this.urlParams?.reportName,
      gwcName: row?.gwcName
    };
    this.getDetailedReport();
    this.initCols();
  }

  refreshTable() {
    this.getGeneralResultOfReport();
  }

  // Generate gateways details in the child table
  getDetailedReport() {
    this.isLoading = true;
    this.reportService.getDetailedReport(this.pathParameters).subscribe(res => {
      this.childTableData = res;
      this.isLoading = false;
    }, error => {
      this.isLoading = false;
      this.commonService.showAPIError(error);
    });
  }

  dataDropdown(arr: ItemDropdown[], item: any, fieldName: any) {
    if (arr && arr.findIndex(i => i.value === item[fieldName]) === -1) {
      if (item[fieldName]) {
        arr.push(new ItemDropdown(item[fieldName], item[fieldName]));
      }
    }
  }

  refreshChildTable() {
    this.getDetailedReport();
  }

  hideContentFileDialog() {
    this.isChildTable = false;
  }

  hidePostGWDialog() {
    this.notFoundGateway = false;
  }

  postGateway(item: IDetailedReport) {
    this.isLoading = true;
    this.reportService.getLMMLineGatewayNames(item.gwName).subscribe(res => {
      if (Array.isArray(res) && res.length > 0 && (res.findIndex(it => it === item.gwName) !== -1)) {
        this.router.navigate([PREFIX_URL + '/home'], { state: { gwName: item.gwName } });
      } else {
        this.notFoundGateway = true;
      }
      this.isLoading = false;
    }, (error) => {
      this.commonService.showAPIError(error);
      this.isLoading = false;
    });
  }
}
