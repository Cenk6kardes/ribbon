import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { DialogLoaderModule, FormToolbarModule, HttpLoaderFactory, PageHeaderModule, PickListTableModule } from 'rbn-common-lib';
import { of, throwError } from 'rxjs';

import { TranslateInternalService } from 'src/app/services/translate-internal.service';
import { CommonService } from 'src/app/services/common.service';
import { ReportService } from '../../services/reports.service';

import { CreateOnDemandReportComponent } from './create-on-demand-report.component';

describe('CreateOnDemandReportComponent', () => {
  let component: CreateOnDemandReportComponent;
  let fixture: ComponentFixture<CreateOnDemandReportComponent>;
  const translateService = {
    translateResults: {
      REPORTS_SCREEN: {
        CREATE_ON_DEMAND_REPORT_TITLE: 'Create On Demand Report',
        GATEWAY_CONTROLLERS: 'Gateway Controller(s)',
        GATEWAY_CONTROLLERS_STATUS: 'Current Status',
        REACHABLE: 'Reachable',
        UNREACHABLE: 'Unreachable'
      }
    }
  };

  const router = {
    navigate: jasmine.createSpy('navigate')
  };

  const getwayDevices = [
    { gwcAlias: 'GWC-1', gwcStatus: true },
    { gwcAlias: 'GWC-0', gwcStatus: false },
    { gwcAlias: 'GWC-3', gwcStatus: true }
  ];

  const reportService = {
    getGatewayControllersList: () => of(getwayDevices),
    postTroubleQueryAllGWControllers: () => of(true),
    postTroubleQueryGWControllers: () => of(true)
  };

  const commonService = jasmine.createSpyObj('messService', ['showAPIError']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateOnDemandReportComponent],
      imports: [
        HttpClientTestingModule,
        DialogLoaderModule,
        PageHeaderModule,
        FormToolbarModule,
        PickListTableModule,
        RouterTestingModule,
        BrowserAnimationsModule,
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
        { provide: CommonService, useValue: commonService }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CreateOnDemandReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call onBack function', () => {
    component.onBack();
    expect(router.navigate).toHaveBeenCalled();
  });

  it('should call onRun function when the user click on the primary button ', () => {
    spyOn(component, 'onRun');
    component.buttonClickedEmit('primary');
    expect(component.onRun).toHaveBeenCalled();
  });

  it('should call onBack function when the user click on the secondary button ', () => {
    spyOn(component, 'onBack');
    component.buttonClickedEmit('secondary');
    expect(component.onBack).toHaveBeenCalled();
  });

  it('should return a list of dateway controls', () => {
    component.getGatewayControllersList();
    reportService.getGatewayControllersList().subscribe(res => {
      expect(component.dataGatewayControlSource).toEqual(res);
      expect(component.isLoading).toBe(false);
    });
  });

  it('should not return a list of dateway controls when getting error API', () => {
    spyOn(reportService, 'getGatewayControllersList').and.returnValue(throwError('error'));
    component.getGatewayControllersList();
    expect(component.isLoading).toBe(false);
  });

  it('should call onBack function when the user post trouble query all gateway controllers succesfully ', () => {
    spyOn(component, 'onBack');
    component.dataGatewayControl.target = [
      { gwcAlias: 'GWC-1', gwcStatus: true },
      { gwcAlias: 'GWC-3', gwcStatus: true }
    ];

    component.reachableGWCData = component.dataGatewayControl.target;
    component.onRun();
    reportService.postTroubleQueryAllGWControllers().subscribe(res => {
      expect(component.isLoading).toBe(false);
      expect(component.onBack).toHaveBeenCalled();
    });
  });

  it('should call showAPIError function when the user post trouble query all gateway controllers failed ', () => {
    component.dataGatewayControl.target = [
      { gwcAlias: 'GWC-1', gwcStatus: true },
      { gwcAlias: 'GWC-3', gwcStatus: true }
    ];
    component.reachableGWCData = component.dataGatewayControl.target;
    spyOn(reportService, 'postTroubleQueryAllGWControllers').and.returnValue(throwError('error'));
    component.onRun();
    expect(component.isLoading).toEqual(false);
    expect(commonService.showAPIError).toHaveBeenCalled();
  });

  it('should call onBack function when the user post trouble query gateway controllers succesfully ', () => {
    spyOn(component, 'onBack');
    component.dataGatewayControl.target = [
      { gwcAlias: 'GWC-1', gwcStatus: true },
      { gwcAlias: 'GWC-3', gwcStatus: true }
    ];
    component.onRun();
    reportService.postTroubleQueryGWControllers().subscribe(res => {
      expect(component.isLoading).toBe(false);
      expect(component.onBack).toHaveBeenCalled();
    });
  });

  it('should call showAPIError function when the user post trouble query gateway controllers failed ', () => {
    component.dataGatewayControl.target = [
      { gwcAlias: 'GWC-1', gwcStatus: true },
      { gwcAlias: 'GWC-3', gwcStatus: true }
    ];
    component.reachableGWCData = [];
    spyOn(reportService, 'postTroubleQueryGWControllers').and.returnValue(throwError('error'));
    component.onRun();
    expect(component.isLoading).toEqual(false);
    expect(commonService.showAPIError).toHaveBeenCalled();
  });

  it('should call onChangeDataResourceGroupsPickList function when the user wants to pick a data', () => {
    component.onChangeDataResourceGroupsPickList({
      target: [
        { gwcAlias: 'GWC-1', gwcStatus: true },
        { gwcAlias: 'GWC-3', gwcStatus: true }
      ],
      source: []
    });
    expect(component.dataGatewayControl).not.toBeUndefined();
  });
});
