import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { of, throwError } from 'rxjs';

import { DialogLoaderModule, PageHeaderModule, RbnCommonTableModule } from 'rbn-common-lib';

import { TranslateInternalService } from 'src/app/services/translate-internal.service';
import { HttpLoaderFactory } from 'src/app/shared/http-loader-factory';
import { ReportService } from '../../services/reports.service';
import { CommonService } from 'src/app/services/common.service';
import { ViewReportComponent } from './view-report.component';

describe('ViewReportComponent', () => {
  let component: ViewReportComponent;
  let fixture: ComponentFixture<ViewReportComponent>;
  const commonService = jasmine.createSpyObj('commonService', ['showAPIError']);
  const translateService = {
    translateResults: {
      REPORTS_SCREEN: {
        REPORTS_TITLE: 'Reports',
        TYPE: 'Type',
        GATEWAY_CONTROLLER_NAME: 'Gateway Controller Name',
        QUERY_RESULT: 'Query Result',
        NUMBER_OF_GATEWAYS: 'Number of Gateways',
        GATEWAY_DETAIL_DIALOG_TITLE: 'Gateway Details',
        GATEWAY_NAME: 'Gateway Name',
        TROUBLE_STATE_INFORMATION: 'Trouble state information',
        POST_ACTION: 'Post',
        POST_GATEWAY_MESSAGE: 'Gateway not found or not supported'
      },
      COMMON: {
        ACTION: 'Action'
      }
    }
  };

  const router = {
    navigate: jasmine.createSpy('navigate')
  };

  const generalReports = [
    {
      gwcName: 'GWC-0',
      queryResult: 'Succesful',
      numberOfGW: 4
    },
    {
      gwcName: 'GWC-1',
      queryResult: 'Succesful',
      numberOfGW: 7
    },
    {
      gwcName: 'GWC-2',
      queryResult: 'Succesful',
      numberOfGW: 7
    }
  ];

  const reportDetail = [
    {
      gwName: 'med24softph',
      errorMessage: 'GW DISABLED'
    },
    {
      gwName: 'ncsco24.netas.com.tr',
      errorMessage: 'GW DISABLED'
    }
  ];

  const gateways = ['mediatrix'];

  const reportService = {
    getGeneralResultOfReport: () => of(generalReports),
    getDetailedReport: () => of(reportDetail),
    getLMMLineGatewayNames: () => of(gateways)
  };

  const route = {
    routerState: { root: { snapshot: { params: 'report123' } } },
    queryParams: of({ reportType: 'Report_1' })
  };

  let childTableData: any[] = [];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewReportComponent],
      imports: [
        HttpClientTestingModule,
        DialogLoaderModule,
        DialogModule,
        ButtonModule,
        PageHeaderModule,
        RbnCommonTableModule,
        RouterTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        })
      ],
      providers: [
        { provide: TranslateInternalService, useValue: translateService },
        { provide: ReportService, useValue: reportService },
        { provide: Router, useValue: router },
        { provide: ActivatedRoute, useValue: route },
        { provide: CommonService, useValue:  commonService}
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ViewReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    spyOn(component, 'onBack');
    spyOn(component, 'initCols');
    spyOn(component, 'getGeneralResultOfReport');
    component.ngOnInit();
    expect(component.initCols).toHaveBeenCalled();
  });

  it('should call getGeneralResultOfReport failed', () => {
    spyOn(reportService, 'getGeneralResultOfReport').and.returnValue(throwError('error'));
    component.getGeneralResultOfReport();
    expect(commonService.showAPIError).toHaveBeenCalled();
  });

  it('should call onBack function when user wants to back the previous page', () => {
    component.onBack();
    expect(router.navigate).toHaveBeenCalled();
  });

  it('should should the popup has contain the Gateway Details table ', () => {
    spyOn(component, 'getDetailedReport');
    spyOn(component, 'initCols');
    component.onLinkClick(generalReports[0]);
    expect(component.isChildTable).toBe(true);
  });

  it('should return gateways details when calling getDetailedReport function ', () => {
    component.getDetailedReport();
    reportService.getDetailedReport().subscribe(res => {
      expect(component.childTableData).toEqual(res);
      childTableData = res;
      expect(component.isLoading).toBe(false);
    });
  });

  it('should call getDetailedReport failed', () => {
    spyOn(reportService, 'getDetailedReport').and.returnValue(throwError('error'));
    component.getDetailedReport();
    expect(component.isLoading).toBe(false);
    expect(commonService.showAPIError).toHaveBeenCalled();
  });

  it('should show Bulk Actions on the top of Gateways Details table when calling initCols function ', () => {
    component.isChildTable = true;
    component.childTableData = childTableData;
    component.initCols();
    expect(component.initCols).toBeTruthy();
  });

  it('should call refreshTable function ', () => {
    spyOn(component, 'getGeneralResultOfReport');
    component.refreshTable();
    expect(component.getGeneralResultOfReport).toHaveBeenCalled();
  });

  it('should call refreshChildTable function ', () => {
    spyOn(component, 'getDetailedReport');
    component.refreshChildTable();
    expect(component.getDetailedReport).toHaveBeenCalled();
  });

  it('should close the post gateway dialog', () => {
    component.hidePostGWDialog();
    expect(component.notFoundGateway).toBe(false);
  });

  it('should hide content dialog when the user clicks on "Close"', () => {
    component.hideContentFileDialog();
    expect(component.isChildTable).toBe(false);
  });

  // eslint-disable-next-line max-len
  it('should show a popup to notify that we can not find gateway when the user clicks on the post action on the Gateway Details table', () => {
    spyOn(reportService, 'getLMMLineGatewayNames').and.returnValue(throwError('error'));
    const item = { gwName: 'gwName', errorMessage: 'errorMessage' };
    component.postGateway(item);
    expect(commonService.showAPIError).toHaveBeenCalled();
    expect(component.isLoading).toBe(false);
  });

  it('should navigate to the home page when the user posts gateway successfully', () => {
    const item = { gwName: 'mediatrix', errorMessage: 'errorMessage' };
    component.postGateway(item);
    expect(router.navigate).toHaveBeenCalled();
    expect(component.isLoading).toBe(false);

    item.gwName = 'med24softph';
    component.postGateway(item);
    expect(component.notFoundGateway).toBeTrue();
  });
});
