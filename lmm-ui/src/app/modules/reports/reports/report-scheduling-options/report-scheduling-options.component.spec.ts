import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { FormGroup } from '@angular/forms';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';

import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { InputSwitchModule } from 'primeng/inputswitch';
import { PanelModule } from 'primeng/panel';

import {
  DialogLoaderModule,
  FormToolbarModule,
  FormToolbarEmit,
  HttpLoaderFactory,
  PageHeaderModule,
  PanelMessagesModule
} from 'rbn-common-lib';

import { TranslateInternalService } from 'src/app/services/translate-internal.service';
import { ReportService } from '../../services/reports.service';
import { ReportSchedulingOptionsComponent } from './report-scheduling-options.component';
import { CommonService } from 'src/app/services/common.service';

describe('ReportSchedulingOptionsComponent', () => {
  let component: ReportSchedulingOptionsComponent;
  let fixture: ComponentFixture<ReportSchedulingOptionsComponent>;

  const translateService = {
    translateResults: {
      REPORTS_SCREEN: {
        REPORT_SCHEDULING_TITLE: 'Report Status',
        WARNING_MGS_REPORT_SCHEDULING_STATUS: 'Only one scheduled report is allowed at one time.',
        SCHEDULED_REPORT_STATUS: 'Enable / Disable Scheduled Report',
        REPORT_SCHEDULE: 'Report Schedule',
        FREQUENCY: 'Frequency',
        DAILY_REPORT: 'Select All / Daily',
        ENABLED: 'enabled',
        AT_THE_TIME: 'At the time'
      }
    }
  };

  const queryConfiguration = {
    enabled: true,
    timeToRun: '02:00:00',
    daily: true,
    sunday: true,
    monday: false,
    tuesday: false,
    wednesday: true,
    thursday: false,
    friday: true,
    saturday: false
  };

  const reportService = {
    getQueryConfiguration: () => of(queryConfiguration),
    runQueryConfiguration: () => of(true)
  };

  const commonService = jasmine.createSpyObj('messService', ['formatTime', 'showAPIError', 'showSuccessMessage']);

  const router = {
    navigate: jasmine.createSpy('navigate')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReportSchedulingOptionsComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        ReactiveFormsModule,
        FormsModule,
        InputSwitchModule,
        CheckboxModule,
        CalendarModule,
        DialogLoaderModule,
        PageHeaderModule,
        PanelMessagesModule,
        FormToolbarModule,
        BrowserAnimationsModule,
        PanelModule,
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
        { provide: CommonService, useValue: commonService },
        { provide: ReportService, useValue: reportService },
        { provide: Router, useValue: router }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ReportSchedulingOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should call ngOnInit function', () => {
    expect(component).toBeTruthy();
  });

  it('should fill available values that return get API Query Configuration successfully', () => {
    component.getQueryConfiguration();
    reportService.getQueryConfiguration().subscribe(res => {
      expect(component.formGroup.value.enabled).toEqual(res.enabled);
      expect(component.formGroup.value.daily).toEqual(res.daily);
    });
  });

  it('should not fill available values that return get API Query Configuration failed', () => {
    spyOn(reportService, 'getQueryConfiguration').and.returnValue(throwError('error'));
    component.getQueryConfiguration();
    expect(component.isLoading).toBe(false);
    expect(commonService.showAPIError).toHaveBeenCalled();
  });

  it('should call onBack function when the user wants to back the parent page', () => {
    component.onBack();
    expect(router.navigate).toHaveBeenCalled();
  });

  it('should call ngOnInit function', () => {
    expect(component).toBeTruthy();
  });

  it('should call onSave function when the user clicks on the save button', () => {
    spyOn(component, 'onSave');
    component.buttonClickedEmit(FormToolbarEmit.primary);
    expect(component.onSave).toHaveBeenCalled();
  });

  it('should call onBack function when the user clicks on the close button', () => {
    spyOn(component, 'onBack');
    component.buttonClickedEmit(FormToolbarEmit.secondary);
    expect(component.onBack).toHaveBeenCalled();
  });

  it('should run query configuaration successfully', () => {
    spyOn(component, 'handleDataBeforeSubmit').and.returnValue({ timeToRun: new Date() /* Other properties */ });;
    spyOn(component, 'onBack');
    component.onSave();
    reportService.runQueryConfiguration().subscribe(() => {
      expect(component.isLoading).toBe(false);
      expect(component.onBack).toHaveBeenCalled();
    });
  });

  it('should run query configuaration ', () => {
    spyOn(reportService, 'runQueryConfiguration').and.returnValue(throwError('error'));
    component.onSave();
    expect(component.isLoading).toBe(false);
    expect(commonService.showAPIError).toHaveBeenCalled();
  });

  it('should set daily to false if any checkbox value is false', () => {
    const dayGroup = component.formGroup.get('day') as FormGroup;
    const checkboxSun = dayGroup.get('sunday') as FormControl;
    const checkboxMon = dayGroup.get('monday') as FormControl;
    const checkboxTue = dayGroup.get('tuesday') as FormControl;
    const checkboxWed = dayGroup.get('wednesday') as FormControl;
    const checkboxThu = dayGroup.get('thursday') as FormControl;
    const checkboxFri = dayGroup.get('friday') as FormControl;
    const checkboxSat = dayGroup.get('saturday') as FormControl;

    checkboxSun.setValue(true);
    checkboxMon.setValue(false);
    checkboxTue.setValue(true);
    checkboxWed.setValue(false);
    checkboxThu.setValue(true);
    checkboxFri.setValue(false);
    checkboxSat.setValue(false);

    component.onCheckboxChange();
    expect(component.formGroup.get('daily')?.value).toBe(false);
  });

  it('should set daily to true if all checkbox values are true', () => {
    const dayGroup = component.formGroup.get('day') as FormGroup;
    const checkboxSun = dayGroup.get('sunday') as FormControl;
    const checkboxMon = dayGroup.get('monday') as FormControl;
    const checkboxTue = dayGroup.get('tuesday') as FormControl;
    const checkboxWed = dayGroup.get('wednesday') as FormControl;
    const checkboxThu = dayGroup.get('thursday') as FormControl;
    const checkboxFri = dayGroup.get('friday') as FormControl;
    const checkboxSat = dayGroup.get('saturday') as FormControl;

    checkboxSun.setValue(true);
    checkboxMon.setValue(true);
    checkboxTue.setValue(true);
    checkboxWed.setValue(true);
    checkboxThu.setValue(true);
    checkboxFri.setValue(true);
    checkboxSat.setValue(true);

    component.onCheckboxChange();
    expect(component.formGroup.get('daily')?.value).toBe(true);
  });

  it('should select all checkboxes when selectDaily is called with checked=true', () => {
    const dayGroup = component.formGroup.get('day') as FormGroup;
    const checkboxSun = dayGroup.get('sunday') as FormControl;
    const checkboxMon = dayGroup.get('monday') as FormControl;
    const checkboxTue = dayGroup.get('tuesday') as FormControl;
    const checkboxWed = dayGroup.get('wednesday') as FormControl;
    const checkboxThu = dayGroup.get('thursday') as FormControl;
    const checkboxFri = dayGroup.get('friday') as FormControl;
    const checkboxSat = dayGroup.get('saturday') as FormControl;

    component.selectDaily({ checked: true });
    expect(checkboxSun.value).toBe(true);
    expect(checkboxMon.value).toBe(true);
    expect(checkboxTue.value).toBe(true);
    expect(checkboxWed.value).toBe(true);
    expect(checkboxThu.value).toBe(true);
    expect(checkboxFri.value).toBe(true);
    expect(checkboxSat.value).toBe(true);
  });

  it('should deselect all checkboxes when selectDaily is called with checked=false', () => {
    const dayGroup = component.formGroup.get('day') as FormGroup;
    const checkboxSun = dayGroup.get('sunday') as FormControl;
    const checkboxMon = dayGroup.get('monday') as FormControl;
    const checkboxTue = dayGroup.get('tuesday') as FormControl;
    const checkboxWed = dayGroup.get('wednesday') as FormControl;
    const checkboxThu = dayGroup.get('thursday') as FormControl;
    const checkboxFri = dayGroup.get('friday') as FormControl;
    const checkboxSat = dayGroup.get('saturday') as FormControl;

    component.selectDaily({ checked: false });
    expect(checkboxSun.value).toBe(false);
    expect(checkboxMon.value).toBe(false);
    expect(checkboxTue.value).toBe(false);
    expect(checkboxWed.value).toBe(false);
    expect(checkboxThu.value).toBe(false);
    expect(checkboxFri.value).toBe(false);
    expect(checkboxSat.value).toBe(false);
  });
});
