import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { CurrentAuditComponent } from './current-audit.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AuditModule } from '../../audit.module';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'rbn-common-lib';
import { TranslateInternalService } from 'src/app/services/translate-internal.service';
import TRANSLATIONS_EN from '../../../../../assets/i18n/cmtg_en.json';
import { AuditService } from '../../services/audit.service';
import { of } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';
import moment from 'moment';

describe('CurrentAuditComponent', () => {
  let component: CurrentAuditComponent;
  let fixture: ComponentFixture<CurrentAuditComponent>;
  const translateService = {
    translateResults: {
      AUDIT: TRANSLATIONS_EN.AUDIT,
      COMMON: TRANSLATIONS_EN.COMMON
    }
  };
  const rowData = {
    'auditName': 'C20 Data Integrity Audit',
    'startTime': '2023-09-08 16:09:32',
    'userID': 'cmtg',
    'host': '10.254.135.178',
    'auditProcess': 'label 0',
    'completionState': '0%',
    'dropdownActions': []
  };
  const auditService = jasmine.createSpyObj('auditService', [
    'getRunningAudit', 'getAuditState', 'postAudit'
  ]);

  const commonService = jasmine.createSpyObj('commonService', [
    'showAPIError', 'showSuccessMessage', 'getCurrentTime', 'showErrorMessage'
  ]);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CurrentAuditComponent],
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
        { provide: CommonService, useValue: commonService }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CurrentAuditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeAll(() => {
    auditService.getRunningAudit.and.returnValue(of(
      ['C20 Data Integrity Audit;Started at:2023-09-08 16:09:32;UserID:cmtg;Host:10.254.135.178;']
    ));
    auditService.getAuditState.and.returnValue(of({ auditProcess: 'AuditIdle', proportion: 0, completed: -1 }));
    auditService.postAudit.and.returnValue(of('success'));
    commonService.getCurrentTime.and.returnValue(moment().format('HH:mm:ss'));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call doAbort case completed < 100', fakeAsync(() => {
    spyOn(component, 'doGetRunningAudit');
    auditService.getAuditState.and.returnValue(of({ auditProcess: 'AuditIdle', proportion: 0, completed: 10 }));
    auditService.getRunningAudit.and.returnValue(of(
      ['C20 Data Integrity Audit;Started at:2023-09-08 16:09:32;UserID:cmtg;Host:10.254.135.178;']
    ));
    component.doAbort(true, rowData);
    tick(1000);
    expect(commonService.showSuccessMessage).toHaveBeenCalled();
  }));

  it('should call doAbort case completed === 100', () => {
    spyOn(component, 'doGetRunningAudit');
    auditService.getAuditState.and.returnValue(of({ auditProcess: 'AuditIdle', proportion: 100, completed: 100 }));
    auditService.getRunningAudit.and.returnValue(of(
      ['C20 Data Integrity Audit;Started at:2023-09-08 16:09:32;UserID:cmtg;Host:10.254.135.178;']
    ));
    component.doAbort(true, rowData);
    expect(commonService.showErrorMessage).toHaveBeenCalled();
  });

  it('should call showConfirmAbort', () => {
    component.showConfirmAbort(rowData);
    expect(component.confirmAbortAudit.isShowConfirmDialog).toBeTrue();
  });
});
