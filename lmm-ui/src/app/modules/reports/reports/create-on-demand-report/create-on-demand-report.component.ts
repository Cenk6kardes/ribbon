import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { IColsPickList, FilterTypesPickList, IPageHeader, FormToolbarEmit } from 'rbn-common-lib';

import { TranslateInternalService } from 'src/app/services/translate-internal.service';
import { CommonService } from 'src/app/services/common.service';
import { ReportService } from '../../services/reports.service';

import { PREFIX_URL } from 'src/app/types/const';
import { IGateWayController } from 'src/app/shared/models/gateway-controller-element-manager';

@Component({
  selector: 'app-create-on-demand-report',
  templateUrl: './create-on-demand-report.component.html',
  styleUrls: ['./create-on-demand-report.component.scss']
})
export class CreateOnDemandReportComponent implements OnInit {

  headerData: IPageHeader;
  colsGatewayControl: IColsPickList[];
  dataGatewayControlTarget: any[] = [];
  dataGatewayControlSource: any[] = [];
  reachableGWCData: any[] = [];
  dataGatewayControl: any = [];
  translateResults: any;
  isLoading = false;

  constructor(
    private translateService: TranslateInternalService,
    private reportService: ReportService,
    private commonService: CommonService,
    private router: Router
  ) {
    this.translateResults = this.translateService.translateResults.REPORTS_SCREEN;
  }

  ngOnInit(): void {
    this.headerData = {
      title: this.translateResults.CREATE_ON_DEMAND_REPORT_TITLE,
      breadcrumb: [{
        label: this.translateResults.REPORTS_TITLE,
        command: () => {
          this.onBack();
        }
      },
      { label: this.translateResults.CREATE_ON_DEMAND_REPORT_TITLE }
      ]
    };
    this.initGatewayCols();
    this.getGatewayControllersList();
  }

  initGatewayCols() {
    this.colsGatewayControl = [
      {
        field: 'gwcAlias', header: this.translateResults.GATEWAY_CONTROLLERS,
        sort: true, type: FilterTypesPickList.InputText
      },
      {
        field: 'gwcStatus', header: this.translateResults.GATEWAY_CONTROLLERS_STATUS, sort: true
      }
    ];
  }

  getGatewayControllersList() {
    this.isLoading = true;
    this.reportService.getGatewayControllersList().subscribe(res => {
      this.dataGatewayControlSource = res || [];
      this.dataGatewayControlSource.forEach(gw => {
        let gwcStatus = '';
        if (gw?.gwcStatus) {
          gwcStatus = this.translateResults.REACHABLE;
          this.reachableGWCData.push(gw);
        } else {
          gw.isDisabled = true;
          gwcStatus = this.translateResults.UNREACHABLE;
        }
        gw.gwcStatus = gwcStatus;
      });
      this.isLoading = false;
    }, (error) => {
      this.isLoading = false;
      this.commonService.showAPIError(error);
    });
  }

  onChangeDataResourceGroupsPickList($event: any) {
    this.dataGatewayControl = $event;
  }

  onRun() {
    this.isLoading = true;
    // Call API trouble query for all gateway controllers
    if (this.reachableGWCData?.length === this.dataGatewayControl?.target?.length) {
      this.reportService.postTroubleQueryAllGWControllers().subscribe(() => {
        this.isLoading = false;
        this.onBack();
        this.reportService.runQueryProgress = true;
      }, error => {
        this.isLoading = false;
        this.commonService.showAPIError(error, this.translateResults.CREATE_REPORT_FAILED);
      });
    } else {
      const requestBody: string[] = [];
      this.dataGatewayControl.target.forEach((item: IGateWayController) => {
        requestBody.push(item.gwcAlias);
      });
      // Call API trouble query for gateways
      this.reportService.postTroubleQueryGWControllers(requestBody).subscribe(() => {
        this.isLoading = false;
        this.onBack();
        this.reportService.runQueryProgress = true;
      }, error => {
        this.isLoading = false;
        this.commonService.showAPIError(error, this.translateResults.CREATE_REPORT_FAILED);
      });
    }
  }

  onBack() {
    this.router.navigate([PREFIX_URL + '/reports']);
  }

  buttonClickedEmit($event: string) {
    // Click on run button
    if ($event === FormToolbarEmit.primary) {
      this.onRun();
    } else {
      this.onBack();
    }
  }
}
