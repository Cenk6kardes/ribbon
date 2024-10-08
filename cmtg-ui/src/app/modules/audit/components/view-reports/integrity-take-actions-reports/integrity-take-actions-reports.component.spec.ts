import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { HttpLoaderFactory } from 'rbn-common-lib';
import { SharedModule } from 'src/app/shared/shared.module';
import { AuditModule } from '../../../audit.module';
import { TranslateInternalService } from 'src/app/services/translate-internal.service';
import TRANSLATIONS_EN from '../../../../../../assets/i18n/cmtg_en.json';
import { EDataIntegrity } from '../../../models/audit';
import { AuditService } from '../../../services/audit.service';
import { of, throwError } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';
import { IntegrityTakeActionsReportsComponent } from './integrity-take-actions-reports.component';

describe('IntegrityTakeActionsReportsComponent', () => {
  let component: IntegrityTakeActionsReportsComponent;
  let fixture: ComponentFixture<IntegrityTakeActionsReportsComponent>;
  const translateService = {
    translateResults: {
      AUDIT: TRANSLATIONS_EN.AUDIT
    }
  };

  const auditService = jasmine.createSpyObj('auditService', [
    'getAuditReport', 'getlastRunTime', 'postActionProblem'
  ]);
  const commonService = jasmine.createSpyObj('commonService', [
    'showAPIError', 'showSuccessMessage'
  ]);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IntegrityTakeActionsReportsComponent],
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

    fixture = TestBed.createComponent(IntegrityTakeActionsReportsComponent);
    component = fixture.componentInstance;
    component.auditName = EDataIntegrity.C20_DATA_INTEGRITY_AUDIT;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call doGetAuditReport', () => {
    auditService.getAuditReport.and.returnValue(of(
      // eslint-disable-next-line max-len
      [{ 'problemID': '0', 'status': { '__value': 0 }, 'problemDescription': 'GWC-4(10.254.166.32)\'s EXECDATA fields are different from those in Call Agent SERVRINV table.', 'possibleActions': [{ 'correctiveAction': 9, 'correctiveTitle': 'Correct ExecData into SESM', 'correctiveDescription': 'Audit will try to correct EXEC Data into SESM database. But if there is no suitable Codec Profile defined in SESM, this action maybe failed. Then manual action will be required. ' }, { 'correctiveAction': 10, 'correctiveTitle': 'Correct ExecData into Call Agent', 'correctiveDescription': 'Audit will try to correct EXEC Data into Call Agent SERVRINV table.' }], 'index': '0', 'statusText': 'Problem Exists', 'children': [], 'dropdownActions': [] }, { 'problemID': '1', 'status': { '__value': 1 }, 'problemDescription': 'There are 20 unused GlobalIDs in SESM database, and the issue has been corrected automatically.', 'possibleActions': [{ 'correctiveAction': 0, 'correctiveTitle': 'No Action Required', 'correctiveDescription': 'The issue has been corrected automatically, totally 20 unused GlobalIDs have been cleared.' }], 'index': '1', 'statusText': 'Problem Corrected', 'children': [], 'dropdownActions': [] }]
    ));
    spyOn(component, 'getlastRunTime');
    component.doGetAuditReport();
    expect(auditService.getAuditReport).toHaveBeenCalled();
  });

  it('should call doGetAuditReport', () => {
    auditService.getAuditReport.and.returnValue(throwError(''));
    spyOn(component, 'getlastRunTime');
    component.doGetAuditReport();
    expect(commonService.showAPIError).toHaveBeenCalled();
  });

  it('should call getlastRunTime', () => {
    auditService.getlastRunTime.and.returnValue(of('9/15/2023  1:35:08 PM'));
    component.getlastRunTime();
    expect(auditService.getlastRunTime).toHaveBeenCalled();
  });

  it('should call getlastRunTime', () => {
    auditService.getlastRunTime.and.returnValue(throwError(''));
    component.getlastRunTime();
    expect(commonService.showAPIError).toHaveBeenCalled();
  });
  it('should call doRefreshDataTable', () => {
    spyOn(component, 'doGetAuditReport');
    component.doRefreshDataTable();
    expect(component.doGetAuditReport).toHaveBeenCalled();
  });

  it('should call doTakeAction', () => {
    spyOn(component, 'doGetAuditReport');
    auditService.postActionProblem.and.returnValue(of('success'));
    commonService.showSuccessMessage.and.returnValue(of(''));
    const fieldPossibleActionsData = {
      selectedOption: {
        'correctiveAction': 9,
        'correctiveTitle': 'Correct ExecData into SESM',
        // eslint-disable-next-line max-len
        'correctiveDescription': 'Audit will try to correct EXEC Data into SESM database. But if there is no suitable Codec Profile defined in SESM, this action maybe failed. Then manual action will be required. '
      }
    } as any;
    // eslint-disable-next-line max-len
    const rowData = { 'problemID': '0', 'status': { '__value': 0 }, 'problemDescription': 'GWC-4(10.254.166.32)\'s EXECDATA fields are different from those in Call Agent SERVRINV table.', 'possibleActions': [{ 'correctiveAction': 9, 'correctiveTitle': 'Correct ExecData into SESM', 'correctiveDescription': 'Audit will try to correct EXEC Data into SESM database. But if there is no suitable Codec Profile defined in SESM, this action maybe failed. Then manual action will be required. ' }, { 'correctiveAction': 10, 'correctiveTitle': 'Correct ExecData into Call Agent', 'correctiveDescription': 'Audit will try to correct EXEC Data into Call Agent SERVRINV table.' }], 'index': '0', 'statusText': 'Problem Exists', 'children': [], 'dropdownActions': [] };
    component.lastAuditDateValue = '9/15/2023 1:35:08 PM';
    component.auditName = 'C20 Data Integrity Audit';
    component.doTakeAction(fieldPossibleActionsData, rowData);
    expect(component.doGetAuditReport).toHaveBeenCalled();

    auditService.postActionProblem.and.returnValue(throwError(''));
    component.doTakeAction(fieldPossibleActionsData, rowData);
    expect(commonService.showAPIError).toHaveBeenCalled();
  });
});
