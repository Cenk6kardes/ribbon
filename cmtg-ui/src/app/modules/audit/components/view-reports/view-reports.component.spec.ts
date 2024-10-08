import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewReportsComponent } from './view-reports.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'rbn-common-lib';
import { TranslateInternalService } from 'src/app/services/translate-internal.service';
import TRANSLATIONS_EN from '../../../../../assets/i18n/cmtg_en.json';
import { AuditModule } from '../../audit.module';
import { ActivatedRoute } from '@angular/router';
import { CExportReportFileOption, CTypeDataIntegrity, EDataIntegrity } from '../../models/audit';
import { AuditService } from '../../services/audit.service';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';


describe('ViewReportsComponent', () => {
  let component: ViewReportsComponent;
  let fixture: ComponentFixture<ViewReportsComponent>;
  const translateService = {
    translateResults: {
      AUDIT: TRANSLATIONS_EN.AUDIT
    }
  };

  const auditService = jasmine.createSpyObj('auditService', [
    'getReportList', 'getReportFileContent', 'getReportListByCheckAuditTakeActions'
  ]);

  const commonService = jasmine.createSpyObj('commonService', [
    'showAPIError', 'showSuccessMessage'
  ]);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewReportsComponent],
      imports: [
        SharedModule,
        AuditModule,
        HttpClientModule,
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
        { provide: AuditService, useValue: auditService },
        { provide: CommonService, useValue: commonService },
        {
          provide: ActivatedRoute, useValue: {
            snapshot: {
              data: {
                data: {
                  auditDataIntegrity: CTypeDataIntegrity.c20DataIntegrityAudit
                }
              }
            }
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ViewReportsComponent);
    component = fixture.componentInstance;
    auditService.getReportListByCheckAuditTakeActions.and.returnValue(of([
      {
        'reportName': 'ValidLineData-2023.09.15-13.03.gz',
        'reportType': {
          '__value': 0
        },
        'fileURL': 'https://10.254.166.148/sesm/Audit/LineDataIntegrityAudit/ValidLineData-2023.09.15-13.03.gz',
        'fileSize': 203
      }
    ]));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call doGetReports case throwError', () => {
    auditService.getReportListByCheckAuditTakeActions.and.returnValue(throwError(''));
    component.doGetReports(EDataIntegrity.C20_DATA_INTEGRITY_AUDIT);
    expect(auditService.getReportListByCheckAuditTakeActions).toHaveBeenCalled();
  });

  it('should call doViewReport', () => {
    auditService.getReportFileContent.and.returnValue(of('content report'));
    component.typeDataIntegrity = EDataIntegrity.LINE_DATA_INTEGRITY_AUDIT;
    component.doViewReport();
    expect(component.showDataIntegrityReports).toBeTrue();

    auditService.getReportFileContent.and.returnValue(throwError(''));
    component.doViewReport();
    expect(commonService.showAPIError).toHaveBeenCalled();
  });

  it('should call handleShowLoading', () => {
    component.handleShowLoading(false);
    expect(component.isInprocess).toBeFalse();
  });

  it('should call handleExport', () => {
    spyOn(URL, 'createObjectURL');
    spyOn(URL, 'revokeObjectURL');
    component.handleExport({ label: CExportReportFileOption[0].label, value: CExportReportFileOption[0].value });
    component.handleExport({ label: CExportReportFileOption[1].label, value: CExportReportFileOption[1].value });
    expect(URL.createObjectURL).toHaveBeenCalled();
  });
});
