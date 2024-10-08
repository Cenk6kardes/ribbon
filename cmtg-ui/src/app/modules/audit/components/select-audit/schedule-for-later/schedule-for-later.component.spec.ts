import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleForLaterComponent } from './schedule-for-later.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AuditModule } from '../../../audit.module';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'rbn-common-lib';
import { TranslateInternalService } from 'src/app/services/translate-internal.service';
import TRANSLATIONS_EN from '../../../../../../assets/i18n/cmtg_en.json';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { EScheduleType } from '../../../models/audit';
import { AuditService } from '../../../services/audit.service';
import { SimpleChange } from '@angular/core';
import { AuditSubjectService } from '../../../services/audit-subject.service';

describe('ScheduleForLaterComponent', () => {
  let component: ScheduleForLaterComponent;
  let fixture: ComponentFixture<ScheduleForLaterComponent>;

  const auditFormTest = new FormGroupDirective([], []);
  auditFormTest.form = new FormGroup({
    auditName: new FormControl(),
    auditDescription: new FormControl(),
    auditComponent: new FormControl([], Validators.required)
  });
  const auditService = jasmine.createSpyObj('auditService', [
    'getDescription', 'getSessionServerConnected', 'getAuditConfiguration', 'getRunningAudit',
    'getPreparationForAudit', 'getAuditState', 'postAudit', 'postAuditConfiguration'
  ]);
  const translateService = {
    translateResults: {
      AUDIT: TRANSLATIONS_EN.AUDIT,
      COMMON: TRANSLATIONS_EN.COMMON
    }
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ScheduleForLaterComponent],
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
        { provide: AuditService, useValue: auditService },
        { provide: AuditSubjectService }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ScheduleForLaterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call setValueDefaultAuditSchedule case OnceTimeOnly', () => {
    spyOn(component, 'changesScheduleType');
    const defaulValue = {
      'enabled': true, 'timeToRun': '17:31', 'once': true,
      'daily': false, 'weekly': false, 'monthly': false, 'sunday': false,
      'monday': false, 'tuesday': false, 'wednesday': false, 'thursday': false,
      'friday': false, 'saturday': false, 'day': '12-19-2023', 'interval': 1,
      'granularAuditData': { 'data': [{ 'data': 'MCS', 'type': 5 }], 'type': 3, 'count': 1, 'options': 0 }
    };
    component.setValueDefaultAuditSchedule(defaulValue);
    expect(component.changesScheduleType).toHaveBeenCalledWith(EScheduleType.OnceTimeOnly);
  });

  it('should call setValueDefaultAuditSchedule case Daily', () => {
    spyOn(component, 'changesScheduleType');
    // eslint-disable-next-line max-len
    const defaulValue = { 'enabled': true, 'timeToRun': '18:17', 'once': false, 'daily': true, 'weekly': false, 'monthly': false, 'sunday': false, 'monday': false, 'tuesday': false, 'wednesday': false, 'thursday': false, 'friday': false, 'saturday': false, 'day': '', 'interval': 1, 'granularAuditData': { 'data': [{ 'data': 'MCS', 'type': 5 }], 'type': 3, 'count': 1, 'options': 0 } };
    component.setValueDefaultAuditSchedule(defaulValue);
    expect(component.changesScheduleType).toHaveBeenCalledWith(EScheduleType.Daily);
  });

  it('should call setValueDefaultAuditSchedule case Weekly', () => {
    spyOn(component, 'changesScheduleType');
    // eslint-disable-next-line max-len
    const defaulValue = { 'enabled': true, 'timeToRun': '17:35', 'once': false, 'daily': false, 'weekly': true, 'monthly': false, 'sunday': true, 'monday': true, 'tuesday': true, 'wednesday': true, 'thursday': true, 'friday': true, 'saturday': true, 'day': '', 'interval': 1, 'granularAuditData': { 'data': [{ 'data': 'MCS', 'type': 5 }], 'type': 3, 'count': 1, 'options': 0 } };
    component.setValueDefaultAuditSchedule(defaulValue);
    expect(component.changesScheduleType).toHaveBeenCalledWith(EScheduleType.Weekly);
  });

  it('should call setValueDefaultAuditSchedule case Monthly', () => {
    spyOn(component, 'changesScheduleType');
    // eslint-disable-next-line max-len
    const defaulValue = { 'enabled': true, 'timeToRun': '17:36', 'once': false, 'daily': false, 'weekly': false, 'monthly': true, 'sunday': false, 'monday': false, 'tuesday': false, 'wednesday': false, 'thursday': false, 'friday': false, 'saturday': false, 'day': '2', 'interval': 1, 'granularAuditData': { 'data': [{ 'data': 'MCS', 'type': 5 }], 'type': 3, 'count': 1, 'options': 0 } };
    component.setValueDefaultAuditSchedule(defaulValue);
    expect(component.changesScheduleType).toHaveBeenCalledWith(EScheduleType.Monthly);
  });

  it('should call onDateChanged', () => {
    const selectEvent = {
      selectedDate: new Date('1-1-2023'),
      durationButtonClicked: false
    };
    component.getFormFieldScheduleType?.setValue(EScheduleType.OnceTimeOnly);
    component.onDateChanged(selectEvent);
    expect(component.getFormFieldOnceTimeOnlyDateTime?.value !== undefined).toBeTrue();
    component.getFormFieldScheduleType?.setValue(EScheduleType.Daily);
    component.onDateChanged(selectEvent);
    expect(component.getFormFieldDailyStartAt?.value !== undefined).toBeTrue();
    component.getFormFieldScheduleType?.setValue(EScheduleType.Weekly);
    component.onDateChanged(selectEvent);
    expect(component.getFormFieldWeeklyStartAt?.value !== undefined).toBeTrue();
    component.getFormFieldScheduleType?.setValue(EScheduleType.Monthly);
    component.onDateChanged(selectEvent);
    expect(component.getFormFieldMonthlyStartAt?.value !== undefined).toBeTrue();
  });

  it('should call handleSchedule', () => {
    component.changesScheduleType(EScheduleType.Daily);
    expect(component.singleCalendarOptions.timeOnly).toBeTrue();
  });

  it('should call ngOnchange', () => {
    const changeData = { 'showScheduleTypeNow': { 'currentValue': true, 'firstChange': true } };
    const changesObj1 = {
      showScheduleTypeNow: new SimpleChange(null, changeData.showScheduleTypeNow, true)
    };
    component.ngOnChanges(changesObj1);
    expect(component.getFormFieldScheduleType?.value === EScheduleType.Now).toBeTrue();
  });
});
