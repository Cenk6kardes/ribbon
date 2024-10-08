import {
  AfterViewInit, ChangeDetectorRef, Component, EventEmitter,
  Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild
} from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';

import moment from 'moment';
import {
  CAuditConfigInit,
  EScheduleType,
  IAuditConfig,
  daysOfTheWeekOptionsData
} from '../../../models/audit';
import { RbnFocusCalendarDirective, FutureSingleDatePickerComponent } from 'rbn-common-lib';
import { TranslateInternalService } from 'src/app/services/translate-internal.service';
import { AuditSubjectService } from '../../../services/audit-subject.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-schedule-for-later',
  templateUrl: './schedule-for-later.component.html',
  styleUrls: ['./schedule-for-later.component.scss'],
  providers: [
    RbnFocusCalendarDirective
  ]
})
export class ScheduleForLaterComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {
  @ViewChild('singleDatePicker', { static: false }) singleDatePicker!: FutureSingleDatePickerComponent;
  scheduleDefaultValue: IAuditConfig | undefined;
  @Input() scheduleForLaterInfo = true;
  @Input() showScheduleTypeNow = true;
  @Output() statusScheduleToSave = new EventEmitter();
  @Output() evOnChangesScheduleType = new EventEmitter();

  timePickerName = 'once-date';
  daysOfTheWeekOptions = daysOfTheWeekOptionsData;
  eScheduleType = EScheduleType;
  scheduleType = {
    options: [EScheduleType.OnceTimeOnly, EScheduleType.Daily, EScheduleType.Weekly, EScheduleType.Monthly, EScheduleType.Now],
    selected: EScheduleType.OnceTimeOnly,
    scheduleTypeId: 'scheduleTypeId'
  };
  daysOptions: { label: string, value: string }[];

  scheduleForm: FormGroup<any>;

  singleCalendarConfig: { selectedDate: any, label?: string } = { selectedDate: '' };
  singleCalendarOptions = {
    timeOnly: false,
    placeholder: '',
    label: '',
    headerTimePicker: ''
  };
  timeFormat = 'HH:mm';
  dayFormat = 'MM-DD-YYYY';
  defaultDate = moment().minutes(0).toDate();
  granularAuditDataChangeSubscription: Subscription;
  disabledTimePicker = false;

  get getFormFieldScheduleType() {
    return this.scheduleForm.get('ScheduleType');
  }
  get getFormFieldOnceTimeOnly() {
    return this.scheduleForm.get('OnceTimeOnly');
  }
  get getFormFieldOnceTimeOnlyDateTime() {
    return this.scheduleForm.get('OnceTimeOnly.DateTime');
  }
  get getFormFieldDaily() {
    return this.scheduleForm.get('Daily');
  }
  get getFormFieldDailyStartAt() {
    return this.scheduleForm.get('Daily.StartAt');
  }
  get getFormFieldWeekly() {
    return this.scheduleForm.get('Weekly');
  }
  get getFormFieldWeeklyEvery() {
    return this.scheduleForm.get('Weekly.Every');
  }
  get getFormFieldWeeklyStartAt() {
    return this.scheduleForm.get('Weekly.StartAt');
  }
  get getFormFieldMonthly() {
    return this.scheduleForm.get('Monthly');
  }
  get getFormFieldMonthlyDayOfMonth() {
    return this.scheduleForm.get('Monthly.dayOfMonth');
  }
  get getFormFieldMonthlyStartAt() {
    return this.scheduleForm.get('Monthly.StartAt');
  }

  translateResults: any;
  auditName = '';

  get getFormFieldAuditName() {
    return this.rootFormGroup.form?.get('auditName');
  }

  constructor(
    private translateInternalService: TranslateInternalService,
    public rootFormGroup: FormGroupDirective,
    private cdr: ChangeDetectorRef,
    public auditSubjectService: AuditSubjectService
  ) {
    this.translateResults = this.translateInternalService.translateResults;
    this.scheduleForm = new FormGroup({
      ScheduleType: new FormControl(this.showScheduleTypeNow ? EScheduleType.Now: EScheduleType.OnceTimeOnly, Validators.required),
      OnceTimeOnly: new FormGroup({
        DateTime: new FormControl(null, Validators.required)
      }),
      Daily: new FormGroup({
        StartAt: new FormControl(null, Validators.required)
      }),
      Weekly: new FormGroup({
        Every: new FormControl(null, Validators.required),
        StartAt: new FormControl(null, Validators.required)
      }),
      Monthly: new FormGroup({
        dayOfMonth: new FormControl(null, Validators.required),
        StartAt: new FormControl(null, Validators.required)
      })
    });
  }

  ngOnInit(): void {
    this.daysOptions = this.createDaysOptionsData();
    this.auditName = this.getFormFieldAuditName?.value || '';
    this.granularAuditDataChangeSubscription = this.auditSubjectService.granularAuditDataChangeSubject.subscribe({
      next: (granularData) => {
        this.scheduleDefaultValue = granularData ? granularData.scheduleDefault : undefined;
        if (this.scheduleDefaultValue) {
          this.setValueDefaultAuditSchedule(this.scheduleDefaultValue);
        } else {
          this.checkStatusScheduleToSave();
        }
      }
    });
    this.scheduleForm.valueChanges.subscribe({
      next: () => {
        this.checkStatusScheduleToSave();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['showScheduleTypeNow']) {
      if (this.showScheduleTypeNow) {
        this.getFormFieldScheduleType?.setValue(EScheduleType.Now);
      }
    }
  }

  ngAfterViewInit(): void {
    this.changesScheduleType(this.getFormFieldScheduleType?.value);
    this.cdr.detectChanges();
  }

  getBodyDataSchedule() {
    const bodyData: IAuditConfig = { ...CAuditConfigInit };
    const scheduleTypeValue = this.getFormFieldScheduleType?.value;
    if (scheduleTypeValue === EScheduleType.OnceTimeOnly) {
      bodyData.once = true;
      bodyData.day = moment(this.getFormFieldOnceTimeOnlyDateTime?.value).format(this.dayFormat);
      bodyData.timeToRun = moment(this.getFormFieldOnceTimeOnlyDateTime?.value).format(this.timeFormat);
    } else {
      bodyData.once = false;
      if (scheduleTypeValue === EScheduleType.Daily) {
        // daily
        bodyData.daily = true;
        bodyData.timeToRun = moment(this.getFormFieldDailyStartAt?.value).format(this.timeFormat);
      }
      if (scheduleTypeValue === EScheduleType.Weekly) {
        // Weekly
        bodyData.weekly = true;
        const daysOfTheWeek = this.getFormFieldWeeklyEvery?.value || [];
        bodyData.monday = daysOfTheWeek.includes(daysOfTheWeekOptionsData[0].value);
        bodyData.tuesday = daysOfTheWeek.includes(daysOfTheWeekOptionsData[1].value);
        bodyData.wednesday = daysOfTheWeek.includes(daysOfTheWeekOptionsData[2].value);
        bodyData.thursday = daysOfTheWeek.includes(daysOfTheWeekOptionsData[3].value);
        bodyData.friday = daysOfTheWeek.includes(daysOfTheWeekOptionsData[4].value);
        bodyData.saturday = daysOfTheWeek.includes(daysOfTheWeekOptionsData[5].value);
        bodyData.sunday = daysOfTheWeek.includes(daysOfTheWeekOptionsData[6].value);
        bodyData.timeToRun = moment(this.getFormFieldWeeklyStartAt?.value).format(this.timeFormat);
      }
      if (scheduleTypeValue === EScheduleType.Monthly) {
        // Monthly
        bodyData.monthly = true;
        bodyData.day = this.getFormFieldMonthlyDayOfMonth?.value;
        bodyData.timeToRun = moment(this.getFormFieldMonthlyStartAt?.value).format(this.timeFormat);
      }
    }
    return bodyData;
  }

  onDateChanged(event: {
    selectedDate: Date | undefined,
    durationButtonClicked: boolean
  }) {
    const scheduleTypeValue = this.getFormFieldScheduleType?.value;
    switch (scheduleTypeValue) {
      case EScheduleType.OnceTimeOnly: {
        if (event.selectedDate === undefined) {
          if (this.scheduleDefaultValue?.once === true) {
            const onceTime = `${this.scheduleDefaultValue?.day} ${this.scheduleDefaultValue?.timeToRun}`;
            this.getFormFieldOnceTimeOnlyDateTime?.setValue(moment(onceTime, `${this.dayFormat} ${this.timeFormat}`));
            this.singleCalendarConfig = { selectedDate: moment(onceTime, `${this.dayFormat} ${this.timeFormat}`) };
          }
        } else {
          this.getFormFieldOnceTimeOnlyDateTime?.setValue(event.selectedDate);
          this.getFormFieldOnceTimeOnly?.markAsDirty();
        }
      }
        break;
      case EScheduleType.Daily: {
        if (event.selectedDate === undefined) {
          if (this.scheduleDefaultValue?.once === false && this.scheduleDefaultValue?.daily) {
            this.getFormFieldDailyStartAt?.setValue(moment(this.scheduleDefaultValue?.timeToRun, this.timeFormat));
            this.singleCalendarConfig = { selectedDate: moment(this.scheduleDefaultValue?.timeToRun, this.timeFormat) };
          }
        } else {
          this.getFormFieldDailyStartAt?.setValue(event.selectedDate);
          this.getFormFieldDaily?.markAsDirty();
        }
      }
        break;
      case EScheduleType.Weekly: {
        if (event.selectedDate === undefined) {
          if (this.scheduleDefaultValue?.once === false && this.scheduleDefaultValue?.weekly) {
            this.getFormFieldWeeklyStartAt?.setValue(moment(this.scheduleDefaultValue?.timeToRun, this.timeFormat));
            this.singleCalendarConfig = { selectedDate: moment(this.scheduleDefaultValue?.timeToRun, this.timeFormat) };
          }
        } else {
          this.getFormFieldWeeklyStartAt?.setValue(event.selectedDate);
          this.getFormFieldWeekly?.markAsDirty();
        }
      }
        break;
      case EScheduleType.Monthly: {
        if (event.selectedDate === undefined) {
          if (this.scheduleDefaultValue?.once === false && this.scheduleDefaultValue?.monthly) {
            this.getFormFieldMonthlyStartAt?.setValue(moment(this.scheduleDefaultValue?.timeToRun, this.timeFormat));
            this.singleCalendarConfig = { selectedDate: moment(this.scheduleDefaultValue?.timeToRun, this.timeFormat) };
          }
        } else {
          this.getFormFieldMonthlyStartAt?.setValue(event.selectedDate);
          this.getFormFieldMonthly?.markAsDirty();
        }
      }
        break;
      default:
        break;
    }
  }

  changesScheduleType(event: string) {
    this.evOnChangesScheduleType.emit(event);
    this.singleCalendarConfig = { selectedDate: '' };
    switch (event) {
      case EScheduleType.OnceTimeOnly: {
        this.disabledTimePicker = false;
        this.singleCalendarOptions.timeOnly = false;
        this.singleCalendarOptions.headerTimePicker = this.translateResults.AUDIT.HEADER.TIMEPICKER;
        this.singleCalendarOptions.placeholder = this.translateResults.AUDIT.FIELD_LABEL.SELECT_DATE_TIME;
        this.singleCalendarOptions.label = this.translateResults.AUDIT.FIELD_LABEL.SELECT_DATE_TIME;
        if (this.singleDatePicker) {
          this.singleDatePicker.startdateValue = undefined;
        }
        this.setValueForTimeSchedule(event);
      }
        break;
      case EScheduleType.Daily:
      case EScheduleType.Weekly:
      case EScheduleType.Monthly:
        this.disabledTimePicker = false;
        this.singleCalendarOptions.timeOnly = true;
        this.singleCalendarOptions.headerTimePicker = this.translateResults.AUDIT.HEADER.TIMEPICKER_TIMEONLY;
        this.singleCalendarOptions.placeholder = this.translateResults.AUDIT.FIELD_LABEL.SELECT_TIME;
        this.singleCalendarOptions.label = this.translateResults.AUDIT.FIELD_LABEL.START_AT;
        if (this.singleDatePicker) {
          this.singleDatePicker.startdateValue = undefined;
        }
        this.setValueForTimeSchedule(event);
        break;
      case EScheduleType.Now: {
        this.singleCalendarOptions.timeOnly = false;
        this.singleCalendarOptions.headerTimePicker = this.translateResults.AUDIT.HEADER.TIMEPICKER;
        this.singleCalendarOptions.placeholder = this.translateResults.AUDIT.FIELD_LABEL.SELECT_DATE_TIME;
        this.singleCalendarOptions.label = this.translateResults.AUDIT.FIELD_LABEL.SELECT_DATE_TIME;
        this.disabledTimePicker = true;
      }
        break;
      default:
        break;
    }
  }

  setValueForTimeSchedule(type: string) {
    switch (type) {
      case EScheduleType.OnceTimeOnly: {
        if (this.getFormFieldOnceTimeOnlyDateTime?.value) {
          this.singleCalendarConfig = { selectedDate: moment(this.getFormFieldOnceTimeOnlyDateTime?.value) };
        }
      }
        break;
      case EScheduleType.Daily: {
        if (this.getFormFieldDailyStartAt?.value) {
          this.singleCalendarConfig = { selectedDate: moment(this.getFormFieldDailyStartAt?.value) };
        }
      }
        break;
      case EScheduleType.Weekly: {
        if (this.getFormFieldWeeklyStartAt?.value) {
          this.singleCalendarConfig = { selectedDate: moment(this.getFormFieldWeeklyStartAt?.value) };
        }
      }
        break;
      case EScheduleType.Monthly: {
        if (this.getFormFieldMonthlyStartAt?.value) {
          this.singleCalendarConfig = { selectedDate: moment(this.getFormFieldMonthlyStartAt?.value) };
        }
      }
        break;
      default:
        break;
    }
  }

  checkStatusScheduleToSave() {
    if (this.getFormFieldScheduleType?.invalid) {
      this.statusScheduleToSave.emit(true);
      return;
    }
    const scheduleType = this.getFormFieldScheduleType?.value;
    if (scheduleType === EScheduleType.OnceTimeOnly) {
      this.statusScheduleToSave.emit(this.getFormFieldOnceTimeOnly?.invalid);
      return;
    }
    if (scheduleType === EScheduleType.Daily) {
      this.statusScheduleToSave.emit(this.getFormFieldDaily?.invalid);
      return;
    }
    if (scheduleType === EScheduleType.Weekly) {
      this.statusScheduleToSave.emit(this.getFormFieldWeekly?.invalid);
      return;
    }
    if (scheduleType === EScheduleType.Monthly) {
      this.statusScheduleToSave.emit(this.getFormFieldMonthly?.invalid);
      return;
    }
    this.statusScheduleToSave.emit(true);
    return;
  }

  setValueDefaultAuditSchedule(configurationResponse: IAuditConfig) {
    if (configurationResponse.timeToRun) {
      const temp = moment(configurationResponse.timeToRun, `${this.timeFormat}`);
      const minuteTemp = temp.minute();
      if (minuteTemp >= 1 && minuteTemp <= 30) {
        configurationResponse.timeToRun = temp.minutes(30).format(this.timeFormat);
      } else {
        configurationResponse.timeToRun = temp.minutes(0).format(this.timeFormat);
      }
    }
    if (configurationResponse.once === true) {
      // set value for scheduleType
      this.getFormFieldScheduleType?.setValue(EScheduleType.OnceTimeOnly);
      this.changesScheduleType(EScheduleType.OnceTimeOnly);
      // set value for Once Time Only
      if (configurationResponse.day && configurationResponse.timeToRun) {
        const onceTime = `${configurationResponse.day} ${configurationResponse.timeToRun}`;
        this.getFormFieldOnceTimeOnlyDateTime?.setValue(moment(onceTime, `${this.dayFormat} ${this.timeFormat}`));
        this.singleCalendarConfig = { selectedDate: moment(onceTime, `${this.dayFormat} ${this.timeFormat}`) };
      }
    }
    if (configurationResponse.once === false) {
      if (configurationResponse.daily) {
        this.getFormFieldScheduleType?.setValue(EScheduleType.Daily);
        this.changesScheduleType(EScheduleType.Daily);
        this.getFormFieldDailyStartAt?.setValue(moment(configurationResponse.timeToRun, this.timeFormat));
        this.singleCalendarConfig = { selectedDate: moment(configurationResponse.timeToRun, this.timeFormat) };
      }
      if (configurationResponse.weekly) {
        this.getFormFieldScheduleType?.setValue(EScheduleType.Weekly);
        this.changesScheduleType(EScheduleType.Weekly);
        // set value Start At
        this.getFormFieldWeeklyStartAt?.setValue(moment(configurationResponse.timeToRun, this.timeFormat));
        this.singleCalendarConfig = { selectedDate: moment(configurationResponse.timeToRun, this.timeFormat) };
        // set value Days Of The Week
        const daysOfTheWeek = [];
        if (configurationResponse.monday) {
          daysOfTheWeek.push(daysOfTheWeekOptionsData[0].value);
        };
        if (configurationResponse.tuesday) {
          daysOfTheWeek.push(daysOfTheWeekOptionsData[1].value);
        };
        if (configurationResponse.wednesday) {
          daysOfTheWeek.push(daysOfTheWeekOptionsData[2].value);
        };
        if (configurationResponse.thursday) {
          daysOfTheWeek.push(daysOfTheWeekOptionsData[3].value);
        };
        if (configurationResponse.friday) {
          daysOfTheWeek.push(daysOfTheWeekOptionsData[4].value);
        };
        if (configurationResponse.saturday) {
          daysOfTheWeek.push(daysOfTheWeekOptionsData[5].value);
        };
        if (configurationResponse.sunday) {
          daysOfTheWeek.push(daysOfTheWeekOptionsData[6].value);
        };
        this.getFormFieldWeeklyEvery?.setValue(daysOfTheWeek);
      }
      if (configurationResponse.monthly) {
        this.getFormFieldScheduleType?.setValue(EScheduleType.Monthly);
        this.changesScheduleType(EScheduleType.Monthly);
        this.getFormFieldMonthlyStartAt?.setValue(moment(configurationResponse.timeToRun, this.timeFormat));
        this.singleCalendarConfig = { selectedDate: moment(configurationResponse.timeToRun, this.timeFormat) };
        // set value for DayOfMonth
        this.getFormFieldMonthlyDayOfMonth?.setValue(configurationResponse.day);
      }
    }
  }

  createDaysOptionsData() {
    const rs = [];
    for (let i = 1; i <= 28; i++) {
      let item = '';
      item = '' + i;
      rs.push({ label: item, value: item });
    }
    return rs;
  }

  ngOnDestroy(): void {
    if (this.granularAuditDataChangeSubscription) {
      this.granularAuditDataChangeSubscription.unsubscribe();
    }
  }
}
