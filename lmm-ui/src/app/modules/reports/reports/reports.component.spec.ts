import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { ProgressBarModule } from 'primeng/progressbar';

import { DialogLoaderModule, PageHeaderModule, RbnCommonTableModule } from 'rbn-common-lib';

import { TranslateInternalService } from 'src/app/services/translate-internal.service';
import { HttpLoaderFactory } from 'src/app/shared/http-loader-factory';
import { ReportService } from '../services/reports.service';

import { ReportsComponent } from './reports.component';
import { CommonService } from 'src/app/services/common.service';

describe('ReportsComponent', () => {
  let component: ReportsComponent;
  let fixture: ComponentFixture<ReportsComponent>;
  const commonService = jasmine.createSpyObj('commonService', ['showErrorMessage', 'showAPIError', 'showSuccessMessage']);

  const translateService = {
    translateResults: {
      REPORTS_SCREEN: {
        REPORTS_TITLE: 'Reports',
        REPORTS_NAME: 'Report Name',
        DATE_CREATE: 'Date Created',
        TYPE: 'Type',
        REPORTS_ACTIONS: 'Report Actions',
        CREATE_ON_DEMAND_REPORT: 'Create On Demand Report',
        REPORTS_SCHEDULING_OPTIONS: 'Report Scheduling Options'
      }
    }
  };
  const reportsList: any[] = [
    {
      fileDisplay: 'Report-2023-05-23-03-00-01(GMT+0300)',
      fileName: 'Report_1',
      fileLMTimeInMillis: 1684800001078
    },
    {
      fileDisplay: 'Report-2023-05-22-03-00-00(GMT+0300)',
      fileName: 'Report_2',
      fileLMTimeInMillis: 1684713600758
    },
    {
      fileDisplay: 'Report-2023-05-21-03-00-01(GMT+0300)',
      fileName: 'Report_3',
      fileLMTimeInMillis: 1684627201477
    },
    {
      fileDisplay: 'Report-2023-05-20-03-00-02(GMT+0300)',
      fileName: 'Report_4',
      fileLMTimeInMillis: 1684540802059
    },
    {
      fileDisplay: 'Report-2023-05-16-03-00-00(GMT+0300)',
      fileName: 'Report_5',
      fileLMTimeInMillis: 1684195200659
    },
    {
      fileDisplay: 'Report-2023-05-15-03-00-01(GMT+0300)',
      fileName: 'Report_6',
      fileLMTimeInMillis: 1684108801120
    },
    {
      fileDisplay: 'Report-2023-05-14-03-00-01(GMT+0300)',
      fileName: 'Report_7',
      fileLMTimeInMillis: 1684022401861
    }
  ];
  const reportService = {
    getListOfReport: () => of(reportsList),
    getQueryProgress: (step: string) => of(6400),
    runQueryProgress: true
  };

  const router = {
    navigate: jasmine.createSpy('navigate')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReportsComponent],
      imports: [
        HttpClientTestingModule,
        DialogLoaderModule,
        PageHeaderModule,
        RbnCommonTableModule,
        ProgressBarModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        })
      ],
      providers: [
        { provide: CommonService, useValue: commonService },
        { provide: TranslateInternalService, useValue: translateService },
        { provide: ReportService, useValue: reportService },
        { provide: Router, useValue: router }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return the list of reports', () => {
    component.getListOfReport();
    reportService.getListOfReport().subscribe((res: any) => {
      expect(res).toEqual(reportsList);
    });
  });

  it('should show the error message when API does not return the list of reports', () => {
    spyOn(reportService, 'getListOfReport').and.returnValue(throwError('error'));
    component.getListOfReport();
    reportService.getListOfReport().subscribe(() => {
      // This testcase won't be expected here
    }, (error) => {
      expect(error).toEqual('error');
      expect(component.isLoading).toBe(false);
    });
  });

  it('should call refreshTable function', () => {
    spyOn(component, 'getListOfReport');
    component.refreshTable();
    expect(component.getListOfReport).toHaveBeenCalled();
  });

  it('should call handleQueryProgress', fakeAsync(() => {
    reportService.runQueryProgress = true;
    spyOn(component, 'getListOfReport');
    spyOn(component, 'stopRunningQueryProcess');
    component.handleQueryProgress();
    tick(5000);
    reportService.getQueryProgress('all').subscribe(value => {
      const time = parseInt((value * 100 * 100 / 6400).toString(), 10);
      const percentage = parseFloat((time / 100).toString());
      expect(component.progressValue).toEqual(percentage);
      expect(component.stopRunningQueryProcess).toHaveBeenCalled();
      expect(component.getListOfReport).toHaveBeenCalled();
      expect(commonService.showSuccessMessage).toHaveBeenCalled();
      component.subscriptionQueryProgress$.unsubscribe();
    });
  }));


  it('should call handleQueryProgress failed', fakeAsync(() => {
    reportService.runQueryProgress = true;
    spyOn(reportService, 'getQueryProgress').and.returnValue(throwError('error'));
    component.handleQueryProgress();
    tick(5000);
    expect(commonService.showAPIError).toHaveBeenCalled();
    component.subscriptionQueryProgress$.unsubscribe();
  }));

  it('should create', () => {
    component.onLinkClick(reportsList[0]);
    expect(router.navigate).toHaveBeenCalled();
  });
});
