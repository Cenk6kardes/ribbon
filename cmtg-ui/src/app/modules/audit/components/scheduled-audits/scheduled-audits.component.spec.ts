import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduledAuditsComponent } from './scheduled-audits.component';
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
import { AuditUtilitiesService } from '../../services/audit-utilities.service';
import { EDataIntegrity } from '../../models/audit';

describe('ScheduledAuditsComponent', () => {
  let component: ScheduledAuditsComponent;
  let fixture: ComponentFixture<ScheduledAuditsComponent>;
  const translateService = {
    translateResults: {
      AUDIT: TRANSLATIONS_EN.AUDIT,
      COMMON: TRANSLATIONS_EN.COMMON
    }
  };

  const auditService = jasmine.createSpyObj('auditService', [
    'getRegisteredAudit', 'getAuditConfiguration', 'getLastRunScheduled', 'postAuditConfiguration', 'getSessionServerConnected'
  ]);

  const SpyAuditUtilitiesService = {
    ...jasmine.createSpyObj('auditUtilitiesService',
      ['getGranularAuditData', 'isScheduledAuditAvailable']),
    registeredAudits: [EDataIntegrity.C20_DATA_INTEGRITY_AUDIT]
  };

  const rowDataSelected = {
    'auditType': 'C20 Data Integrity Audit', 'frequency': 'Once',
    'day': '', 'time': '12-12-2023 16:22',
    'scheduleDefault': {
      'enabled': true, 'timeToRun': '16:22', 'once': true, 'daily': false, 'weekly': false,
      'monthly': false, 'sunday': false, 'monday': false, 'tuesday': false,
      'wednesday': false, 'thursday': false, 'friday': false, 'saturday': false,
      'day': '12-12-2023', 'interval': 1, 'granularAuditData':
        { 'data': [{ 'data': 'MCS', 'type': 5 }], 'type': 3, 'count': 1, 'options': 0 }
    }
  };
  const mockDataWeekly = {
    'auditType': 'C20 Data Integrity Audit',
    'data': {
      'enabled': true, 'timeToRun': '11:00', 'once': false, 'daily': false,
      'weekly': true, 'monthly': false, 'sunday': false, 'monday': true,
      'tuesday': true, 'wednesday': false, 'thursday': false,
      'friday': false, 'saturday': false, 'day': '', 'interval': 1,
      'granularAuditData': { 'data': [{ 'data': 'C20', 'type': 4 }], 'type': 3, 'count': 1, 'options': 0 }
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ScheduledAuditsComponent],
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
        { provide: AuditUtilitiesService, useValue: SpyAuditUtilitiesService }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ScheduledAuditsComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  beforeAll(() => {
    auditService.getRegisteredAudit.and.returnValue(of(
      [
        'C20 Data Integrity Audit'
      ]
    ));
    auditService.getAuditConfiguration.and.returnValue(of(
      mockDataWeekly
    ));
    auditService.getLastRunScheduled.and.returnValue(of(
      '11-9-2023'
    ));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getScheduledAuditsData case weekly', () => {
    auditService.getAuditConfiguration.withArgs('C20 Data Integrity Audit').and.returnValue(of(mockDataWeekly));
    SpyAuditUtilitiesService.isScheduledAuditAvailable.and.returnValue(true);
    const combinedData = [mockDataWeekly];
    component.getScheduledAuditsData();
    expect(component.dataScheduledAudits.length > 0).toBeTrue();
  });

  it('should call getScheduledAuditsData case daily', () => {
    auditService.getAuditConfiguration.and.returnValue(of(
      {
        auditType: 'C20 Data Integrity Audit',
        data: {
          'enabled': true, 'timeToRun': '11:00', 'once': false,
          'daily': true, 'weekly': false, 'monthly': false, 'sunday': false,
          'monday': false, 'tuesday': false, 'wednesday': false, 'thursday': false,
          'friday': false, 'saturday': false, 'day': '', 'interval': 1,
          'granularAuditData': { 'data': [{ 'data': 'C20', 'type': 4 }], 'type': 3, 'count': 1, 'options': 0 }
        }
      }
    ));
    SpyAuditUtilitiesService.isScheduledAuditAvailable.and.returnValue(true);
    component.getScheduledAuditsData();
    expect(component.dataScheduledAudits.length > 0).toBeTrue();
  });

  it('should call getScheduledAuditsData case Monthly', () => {
    auditService.getAuditConfiguration.and.returnValue(of(
      {
        auditType: 'C20 Data Integrity Audit',
        data: {
          'enabled': true, 'timeToRun': '16:33', 'once': false, 'daily': false,
          'weekly': false, 'monthly': true, 'sunday': false, 'monday': false, 'tuesday': false,
          'wednesday': false, 'thursday': false, 'friday': false, 'saturday': false, 'day': '4',
          'interval': 1, 'granularAuditData': { 'data': [{ 'data': 'MCS', 'type': 5 }], 'type': 3, 'count': 1, 'options': 0 }
        }
      }
    ));
    SpyAuditUtilitiesService.isScheduledAuditAvailable.and.returnValue(true);
    component.getScheduledAuditsData();
    expect(component.dataScheduledAudits.length > 0).toBeTrue();
  });

  it('should call showConfirmDelete', () => {
    component.showConfirmDelete(rowDataSelected);
    expect(component.confirmDelete.isShowConfirmDialog).toBeTrue();
    component.confirmDelete.isShowConfirmDialog = false;
  });

  it('should call setStateButtonSave', () => {
    component.rowEditSelected = undefined;
    component.invalidScheduleToSave = false;
    component.invalidConfigurationToSave = false;
    const check = component.setStateButtonSave();
    expect(check).toBeFalse();
  });

  it('should call doRefreshDataTable', () => {
    spyOn(component, 'getScheduledAuditsData');
    component.doRefreshDataTable();
    expect(component.getScheduledAuditsData).toHaveBeenCalled();
  });

  it('should call closeDialog', () => {
    component.closeDialog();
    expect(component.rowEditSelected).toBe(undefined);
  });

  it('should call doGetAuditConfiguration', () => {
    auditService.getSessionServerConnected.and.returnValue(of('true'));
    spyOn(component, 'handleChangeAudit');
    component.doGetAuditConfiguration(rowDataSelected);
    expect(component.handleChangeAudit).toHaveBeenCalled();
  });

  it('should call handleChangeAudit', () => {
    component.handleChangeAudit(EDataIntegrity.C20_DATA_INTEGRITY_AUDIT);
    expect(component.auditForm.get('auditComponent') !== undefined).toBeTrue();
    component.handleChangeAudit(EDataIntegrity.LINE_DATA_INTEGRITY_AUDIT);
    expect(component.auditForm.get('auditConfiguration') !== undefined).toBeTrue();
    component.handleChangeAudit(EDataIntegrity.TRUNK_DATA_INTEGRITY_AUDIT);
    expect(component.auditForm.get('auditTrunk') !== undefined).toBeTrue();
    component.handleChangeAudit(EDataIntegrity.V52_DATA_INTEGRITY_AUDIT);
    expect(component.auditForm.get('auditV52') !== undefined).toBeTrue();
  });
});
