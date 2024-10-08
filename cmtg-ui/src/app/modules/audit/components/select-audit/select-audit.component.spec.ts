import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectAuditComponent } from './select-audit.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuditModule } from '../../audit.module';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'rbn-common-lib';
import { TranslateInternalService } from 'src/app/services/translate-internal.service';
import TRANSLATIONS_EN from '../../../../../assets/i18n/cmtg_en.json';
import { ActivatedRoute, Router } from '@angular/router';
import { CTypeDataIntegrity, EDataIntegrity } from '../../models/audit';
import { AuditService } from '../../services/audit.service';
import { of } from 'rxjs';
import { AuditUtilitiesService } from '../../services/audit-utilities.service';

describe('SelectAuditComponent', () => {
  let component: SelectAuditComponent;
  let fixture: ComponentFixture<SelectAuditComponent>;
  const translateService = {
    translateResults: {
      AUDIT: TRANSLATIONS_EN.AUDIT,
      COMMON: TRANSLATIONS_EN.COMMON
    }
  };
  const auditService = jasmine.createSpyObj('auditService', [
    'getDescription', 'getSessionServerConnected', 'getAuditConfiguration', 'getRunningAudit',
    'getPreparationForAudit', 'getAuditState', 'postAudit', 'postAuditConfiguration'
  ]);
  const router = jasmine.createSpyObj('router', ['navigateByUrl', 'navigate']);
  const SpyAuditUtilitiesService = {
    ...jasmine.createSpyObj('auditUtilitiesService',
      ['getGranularAuditData', 'isScheduledAuditAvailable']),
    registeredAudits: [EDataIntegrity.C20_DATA_INTEGRITY_AUDIT],
    itemsSideBarAudit: [
      {
        'path': 'main/audit/c20-data-integrity',
        'routeType': 'INTERNAL',
        'data': {
          'menu': {
            'title': 'C20 Data Integrity',
            'sidebarLabel': 'C20 Data Integrity'
          }
        },
        'fullPath': '/main/audit/main/audit/c20-data-integrity',
        'title': 'C20 Data Integrity',
        'display': 'C20 Data Integrity',
        'sidebarLabel': 'C20 Data Integrity',
        'route': {
          'paths': 'main/audit/c20-data-integrity',
          'fullPath': '/main/audit/main/audit/c20-data-integrity'
        }
      }
    ]
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectAuditComponent],
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
        },
        { provide: AuditService, useValue: auditService },
        { provide: Router, useValue: router },
        { provide: AuditUtilitiesService, useValue: SpyAuditUtilitiesService }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SelectAuditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeAll(() => {
    auditService.getDescription.and.returnValue(of('description'));
    auditService.getSessionServerConnected.and.returnValue(of('true'));
    auditService.getAuditConfiguration.and.returnValue(of({
      auditType: 'C20 Data Integrity Audit',
      data: {
        'enabled': true, 'timeToRun': '16:22', 'once': true,
        'daily': false, 'weekly': false, 'monthly': false,
        'sunday': false, 'monday': false, 'tuesday': false,
        'wednesday': false, 'thursday': false, 'friday': false,
        'saturday': false, 'day': '12-12-2023', 'interval': 1,
        'granularAuditData': { 'data': [{ 'data': 'MCS', 'type': 5 }], 'type': 3, 'count': 1, 'options': 0 }
      }
    }));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call checkRunningAudit', () => {
    // eslint-disable-next-line max-len
    auditService.getRunningAudit.and.returnValue(of(['C20 Data Integrity Audit;Started at:2023-09-08 16:09:32;UserID:cmtg;Host:10.254.135.178;']));
    component.checkRunningAudit();
    expect(component.confirmRunAudit.isShowConfirmDialog).toBeTrue();
    component.confirmRunAudit.isShowConfirmDialog = false;
  });

  it('should call processAudit', () => {
    spyOn(component, 'doPutAudit').and.returnValue(of({
      'returnCode': true,
      'numProblemsRecorded': 6
    }));
    // eslint-disable-next-line max-len
    auditService.getPreparationForAudit.and.returnValue(of('true'));
    auditService.getAuditState.and.returnValue(of({
      'auditProcess': 'label 0',
      'proportion': 0,
      'completed': -1
    }));
    component.getFormFieldAuditName?.setValue(EDataIntegrity.C20_DATA_INTEGRITY_AUDIT);
    component.processAudit(true);
    expect(component.auditSummary.progressBarData.proportionProgressBar).toEqual(100);
  });

  it('should call showConfirmAbort', () => {
    component.showConfirmAbort(true);
    expect(component.confirmRunAudit.isShowConfirmDialog).toBeTrue();
    component.confirmRunAudit.isShowConfirmDialog = false;
  });

  it('should call showConfirmRunAuditNow', () => {
    component.showConfirmRunAuditNow(true);
    expect(component.confirmRunAudit.isShowConfirmDialog).toBeTrue();
    component.confirmRunAudit.isShowConfirmDialog = false;
  });

  it('should call handleRunAuditNow', () => {
    spyOn(component, 'checkRunningAudit');
    component.handleRunAuditNow(true);
    expect(component.confirmRunAudit.isShowConfirmDialog).toBeFalse();
    component.confirmRunAudit.isShowConfirmDialog = false;
    expect(component.checkRunningAudit).toHaveBeenCalled();
  });

  it('should call handleAbort', () => {
    component.getFormFieldAuditName?.setValue('C20 Data Integrity Audit');
    auditService.getRunningAudit.and.returnValue(of(
      ['C20 Data Integrity Audit;Started at:2023-09-08 16:09:32;UserID:cmtg;Host:10.254.135.178;']
    ));
    auditService.postAudit.and.returnValue(of('success'));
    component.handleAbort(true);
    expect(auditService.postAudit).toHaveBeenCalled();
  });

  it('should call doSaveScheduledAudit', () => {
    spyOn(component, 'getAuditConfigurationByConditions');
    auditService.postAuditConfiguration.and.returnValue(of('success'));
    auditService.getSessionServerConnected.and.returnValue(of('true'));
    // eslint-disable-next-line max-len
    component.scheduleDefaultValue = { 'enabled': true, 'timeToRun': '16:22', 'once': true, 'daily': false, 'weekly': false, 'monthly': false, 'sunday': false, 'monday': false, 'tuesday': false, 'wednesday': false, 'thursday': false, 'friday': false, 'saturday': false, 'day': '12-12-2023', 'interval': 1, 'granularAuditData': { 'data': [{ 'data': 'MCS', 'type': 5 }], 'type': 3, 'count': 1, 'options': 0 } };
    component.doSaveDataAudit();
    expect(component.getAuditConfigurationByConditions).toHaveBeenCalled();
  });

  it('should call doRunNowScheduledAudit', () => {
    spyOn(component, 'showConfirmRunAuditNow');
    component.showConfirmRunAuditNow(true);
    expect(component.showConfirmRunAuditNow).toHaveBeenCalled();
  });

  it('should call handleChangeGranularAuditData', () => {
    spyOn(component.auditSubjectService.granularAuditDataChangeSubject, 'next');
    const temp = {
      'auditName': 'Trunk Data Integrity Audit',
      'granularAudit': {
        'data': [],
        'type': 1,
        'count': 2,
        'options': 0
      },
      // eslint-disable-next-line max-len
      scheduleDefault: { 'enabled': true, 'timeToRun': '16:00', 'once': false, 'daily': false, 'weekly': true, 'monthly': false, 'sunday': false, 'monday': true, 'tuesday': false, 'wednesday': false, 'thursday': false, 'friday': false, 'saturday': false, 'day': '', 'interval': 1, 'granularAuditData': { 'data': [{ 'data': 'MCS', 'type': 5 }], 'type': 3, 'count': 1, 'options': 0 } }
    };
    component.handleChangeGranularAuditData(temp);
    expect(component.auditSubjectService.granularAuditDataChangeSubject.next).toHaveBeenCalled();
  });

  it('should call getAuditConfigurationByConditions', () => {
    spyOn(component, 'doGetAuditConfiguration');
    component.getFormFieldAuditName?.setValue(EDataIntegrity.C20_DATA_INTEGRITY_AUDIT);
    component.getAuditConfigurationByConditions();
    expect(component.doGetAuditConfiguration).toHaveBeenCalled();
  });

  it('should call doGetAuditConfiguration', () => {
    spyOn(component, 'handleChangeGranularAuditData');
    component.doGetAuditConfiguration();
    expect(component.handleChangeGranularAuditData).toHaveBeenCalled();
  });
});
