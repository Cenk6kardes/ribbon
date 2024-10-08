import { ComponentFixture, TestBed } from '@angular/core/testing';

import { C20DataIntegrityAuditComponent } from './c20-data-integrity-audit.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AuditModule } from '../../../audit.module';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'rbn-common-lib';
import { TranslateInternalService } from 'src/app/services/translate-internal.service';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import TRANSLATIONS_EN from '../../../../../../assets/i18n/cmtg_en.json';
import { C20AuditComponentOptions } from '../../../models/audit';
import { AuditSubjectService } from '../../../services/audit-subject.service';

describe('C20DataIntegrityAuditComponent', () => {

  const exampleData = {
    'auditName': 'C20 Data Integrity Audit',
    'granularAudit': {
      'data': [{ 'data': 'MCS', 'type': 5 }],
      'type': 3, 'count': 1, 'options': 0
    },
    'scheduleDefault': {
      'enabled': true, 'timeToRun': '16:00', 'once': false, 'daily': false, 'weekly': true,
      'monthly': false, 'sunday': false, 'monday': true,
      'tuesday': false, 'wednesday': false, 'thursday': false,
      'friday': false, 'saturday': false, 'day': '',
      'interval': 1, 'granularAuditData': { 'data': [{ 'data': 'MCS', 'type': 5 }], 'type': 3, 'count': 1, 'options': 0 }
    }
  };

  let component: C20DataIntegrityAuditComponent;
  let fixture: ComponentFixture<C20DataIntegrityAuditComponent>;
  const translateService = {
    translateResults: {
      AUDIT: TRANSLATIONS_EN.AUDIT,
      COMMON: TRANSLATIONS_EN.COMMON
    }
  };
  const auditFormTest = new FormGroupDirective([], []);
  auditFormTest.form = new FormGroup({
    auditName: new FormControl(),
    auditDescription: new FormControl(),
    auditComponent: new FormControl([], Validators.required)
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [C20DataIntegrityAuditComponent],
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
        { provide: FormGroupDirective, useValue: auditFormTest },
        { provide: AuditSubjectService }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(C20DataIntegrityAuditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    component.auditSubjectService.granularAuditDataChangeSubject.next(exampleData);
    expect(component).toBeTruthy();
  });

  it('should call handleChangeIntegrity case accept', () => {
    component.handleChangeIntegrity([C20AuditComponentOptions[1].value], C20AuditComponentOptions[1].value);
    component.confirmIntegrityAudit.handleAccept(false);
    component.confirmIntegrityAudit.handleAccept(true);
    expect(component.confirmIntegrityAudit.isShowConfirmDialog).toBeFalse();
  });

  it('should call checkStatusConfigurationToSave', () => {
    spyOn(component.statusConfigurationToSave, 'emit');
    component.checkStatusConfigurationToSave();
    expect(component.statusConfigurationToSave.emit).toHaveBeenCalled();
  });

  it('should call checkStatusConfigurationToRun', () => {
    spyOn(component.statusConfigurationToRun, 'emit');
    component.checkStatusConfigurationToRun();
    expect(component.statusConfigurationToRun.emit).toHaveBeenCalled();
  });
});
