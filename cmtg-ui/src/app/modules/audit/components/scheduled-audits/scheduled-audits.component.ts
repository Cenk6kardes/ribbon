import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FieldName, FilterTypes, IPageHeader, ITableConfig, Icols } from 'rbn-common-lib';
import { TranslateInternalService } from 'src/app/services/translate-internal.service';
import {
  EDataIntegrity, EScheduledAuditsFrequency, IAuditConfig,
  IGranularAuditData, IScheduledAudit, keyDaysOfTheWeek
} from '../../models/audit';
import { AuditService } from '../../services/audit.service';
import { CommonService } from 'src/app/services/common.service';
import { ScheduleForLaterComponent } from '../select-audit/schedule-for-later/schedule-for-later.component';
import { AuditUtilitiesService } from '../../services/audit-utilities.service';
import { tableConfigCommon } from 'src/app/types/const';
import { AuditSubjectService } from '../../services/audit-subject.service';
import { catchError, finalize, map } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';

@Component({
  selector: 'app-scheduled-audits',
  templateUrl: './scheduled-audits.component.html',
  styleUrls: ['./scheduled-audits.component.scss'],
  providers: [AuditSubjectService]
})
export class ScheduledAuditsComponent implements OnInit {
  @ViewChild('scheduleForLaterTemp', { static: false }) scheduleForLaterComponent!: ScheduleForLaterComponent;

  dataScheduledAudits: IScheduledAudit[] = [];
  headerData: IPageHeader;
  isInprocess = false;
  translateResults: any;
  scheduleForLaterInfo = false;
  rowEditSelected: IScheduledAudit | undefined;
  isSessionServerConnected = true;
  invalidScheduleToSave = false;
  invalidConfigurationToSave = false;

  tableConfig: ITableConfig = {
    ...tableConfigCommon,
    tableOptions: {
      ...tableConfigCommon.tableOptions,
      dataKey: 'auditType'
    },
    selectedRows: [],
    tableName: 'tbScheduledAudits',
    numberRowPerPage: 5,
    rowsPerPageOptions: [5, 10, 15]
  };

  cols: Icols[] = [];

  auditForm: FormGroup;

  confirmDelete: {
    title: string,
    content: string,
    isShowConfirmDialog: boolean,
    titleAccept: string,
    titleReject: string,
    data: IScheduledAudit | undefined
  } = {
      title: '',
      content: '',
      isShowConfirmDialog: false,
      titleAccept: '',
      titleReject: '',
      data: undefined
    };

  get getFormFieldAuditName() {
    return this.auditForm.get('auditName');
  }
  get getFormFieldAuditDescription() {
    return this.auditForm.get('auditDescription');
  }
  get getFormFieldAuditComponent() {
    return this.auditForm.get('auditComponent');
  }
  get getFormFieldAuditConfiguration() {
    return this.auditForm.get('auditConfiguration');
  }
  get getFormFieldAuditConfigurationOptions() {
    return this.getFormFieldAuditConfiguration?.get('options');
  }
  get getFormFieldAuditConfigurationTreePick() {
    return this.getFormFieldAuditConfiguration?.get('treePick');
  }

  constructor(
    private translateInternalService: TranslateInternalService,
    private auditService: AuditService,
    private commonService: CommonService,
    private auditUtilitiesService: AuditUtilitiesService,
    private cdr: ChangeDetectorRef,
    public auditSubjectService: AuditSubjectService
  ) {
    this.translateResults = this.translateInternalService.translateResults;
  }

  ngOnInit(): void {
    this.initActionColumnConfig();
    this.initCols();
    this.confirmDelete.title = this.translateResults.COMMON.DELETE;
    this.confirmDelete.titleAccept = this.translateResults.COMMON.YES;
    this.confirmDelete.titleReject = this.translateResults.COMMON.NO;
    this.initPageHeader();
    this.getScheduledAuditsData();
    this.auditForm = new FormGroup({
      auditName: new FormControl(),
      auditDescription: new FormControl()
    });
  }

  initActionColumnConfig() {
    this.tableConfig.actionColumnConfig = {
      actions: [
        {
          icon: 'fas fa-pencil-square-o',
          label: this.translateResults.COMMON.EDIT,
          tooltip: this.translateResults.COMMON.EDIT,
          onClick: (row: IScheduledAudit) => {
            this.doGetAuditConfiguration(row);
          }
        },
        {
          icon: 'fas fa-trash',
          label: this.translateResults.COMMON.DELETE,
          tooltip: this.translateResults.COMMON.DELETE,
          onClick: (row: IScheduledAudit) => {
            this.showConfirmDelete(row);
          }
        }
      ]
    };
  }

  initCols() {
    this.cols = [
      {
        field: 'auditType', header: this.translateResults.AUDIT.HEADER.COLUMNS.AUDIT_TYPE,
        sort: true, data: [], colsEnable: true, type: FilterTypes.InputText
      },
      {
        field: 'frequency', header: this.translateResults.AUDIT.HEADER.COLUMNS.FREQUENCY,
        sort: true, data: [], colsEnable: true, type: FilterTypes.InputText, options: {}
      },
      {
        field: 'day', header: this.translateResults.AUDIT.HEADER.COLUMNS.DAY,
        sort: true, data: [], colsEnable: true, type: FilterTypes.InputText, options: {}
      },
      {
        field: 'time', header: this.translateResults.AUDIT.HEADER.COLUMNS.TIME,
        sort: true, data: [], colsEnable: true, type: FilterTypes.InputText
      },
      {
        field: FieldName.Action, header: this.translateResults.AUDIT.HEADER.COLUMNS.ACTION,
        sort: false, data: [], colsEnable: true, autoSetWidth: false
      }
    ];
  }

  getScheduledAuditsData() {
    this.dataScheduledAudits = [];
    this.isInprocess = true;
    const tempDataScheduled: IScheduledAudit[] = [];
    const resRegisteredAudit = this.auditUtilitiesService.registeredAudits;
    const forkJoinData = forkJoin(resRegisteredAudit
      .map(item => this.auditService.getAuditConfiguration(item).pipe(catchError(() => of(null)))));
    forkJoinData.pipe(map((rs) => {
      const rsFilter = rs.filter(n => n !== null) as { auditType: string, data: IAuditConfig }[];
      rsFilter.sort((a, b) => a.auditType.toLowerCase().localeCompare(b.auditType.toLowerCase()));
      return rsFilter;
    })).subscribe({
      next: (rs) => {
        for (let i = 0; i < rs.length; i++) {
          const itemScheduledAudits: IScheduledAudit = {
            auditType: '',
            frequency: '',
            day: '',
            time: '',
            scheduleDefault: undefined
          };
          itemScheduledAudits.auditType = rs[i].auditType;
          const resConfiguration = rs[i].data;
          const scheduledAvailable = this.auditUtilitiesService.isScheduledAuditAvailable(resConfiguration);
          if (scheduledAvailable) {
            itemScheduledAudits.scheduleDefault = resConfiguration;
            tempDataScheduled.push(itemScheduledAudits);
            if (resConfiguration.once) { // OnceTimeOnly
              itemScheduledAudits.frequency = EScheduledAuditsFrequency.OnceTimeOnly;
              itemScheduledAudits.time = `${resConfiguration.timeToRun}`;
              itemScheduledAudits.day = `${resConfiguration.day}`;
            } else if (resConfiguration.weekly) { // Weekly
              // frequency
              itemScheduledAudits.frequency = EScheduledAuditsFrequency.Weekly;
              // every
              const weekdaysScheduled: string[] = [];
              const keyWeekdays = keyDaysOfTheWeek;
              Object.keys(resConfiguration).map((key) => {
                if (keyWeekdays.includes(key) && resConfiguration[key as keyof IAuditConfig]) {
                  weekdaysScheduled.push(key.charAt(0).toUpperCase() + key.slice(1));
                }
              });
              itemScheduledAudits.day = weekdaysScheduled.join(', ');
              itemScheduledAudits.time = resConfiguration.timeToRun;
            } else if (resConfiguration.daily) { // Daily
              itemScheduledAudits.frequency = EScheduledAuditsFrequency.Daily;
              itemScheduledAudits.time = resConfiguration.timeToRun;
            } else if (resConfiguration.monthly) { // Monthly
              itemScheduledAudits.frequency = EScheduledAuditsFrequency.Monthly;
              itemScheduledAudits.day = `${resConfiguration.day} (Day of Month)`;
              itemScheduledAudits.time = resConfiguration.timeToRun;
            }
          }
        }
        this.dataScheduledAudits = [...tempDataScheduled];
        this.isInprocess = false;
      },
      error: () => {
        this.dataScheduledAudits = [...tempDataScheduled];
        this.isInprocess = false;
      }
    });
  }

  doRefreshDataTable() {
    this.setRowEditSelected(undefined);
    this.getScheduledAuditsData();
  }

  initPageHeader() {
    this.headerData = {
      title: this.translateResults.AUDIT.HEADER.SCHEDULED_AUDIT
    };
  }

  closeDialog() {
    this.setRowEditSelected(undefined);
    this.auditForm = new FormGroup({
      auditName: new FormControl(),
      auditDescription: new FormControl()
    });
  }

  doGetAuditConfiguration(row: IScheduledAudit) {
    if (row.scheduleDefault) {
      if (row.auditType === EDataIntegrity.C20_DATA_INTEGRITY_AUDIT) {
        this.isInprocess = true;
        this.auditService.getSessionServerConnected().pipe(
          finalize(() => {
            this.isInprocess = false;
            this.setRowEditSelected(row);
            const rowEditSelectedTemp = this.rowEditSelected as IScheduledAudit;
            if (rowEditSelectedTemp.scheduleDefault) {
              this.handleChangeAudit(row.auditType);
              this.handleChangeGranularAuditData(
                {
                  auditName: rowEditSelectedTemp.auditType,
                  granularAudit: rowEditSelectedTemp.scheduleDefault.granularAuditData,
                  scheduleDefault: rowEditSelectedTemp.scheduleDefault
                }
              );
            }
          })
        ).subscribe({
          next: (rs) => {
            if (rs === 'true' || rs === true) {
              this.isSessionServerConnected = true;
            } else {
              this.isSessionServerConnected = false;
            }
          },
          error: () => {
            this.isSessionServerConnected = false;
          }
        });
      } else {
        this.setRowEditSelected(row);
        const rowEditSelectedTemp = this.rowEditSelected as IScheduledAudit;
        if (rowEditSelectedTemp.scheduleDefault) {
          this.handleChangeAudit(row.auditType);
          this.handleChangeGranularAuditData(
            {
              auditName: rowEditSelectedTemp.auditType,
              granularAudit: rowEditSelectedTemp.scheduleDefault.granularAuditData,
              scheduleDefault: rowEditSelectedTemp.scheduleDefault
            }
          );
        }
      }
    }
  }

  handleChangeAudit(item: string) {
    switch (item) {
      case EDataIntegrity.C20_DATA_INTEGRITY_AUDIT: {
        this.auditForm = new FormGroup({
          auditName: new FormControl(),
          auditDescription: new FormControl(),
          auditComponent: new FormControl([], Validators.required)
        });
      }
        break;
      case EDataIntegrity.LINE_DATA_INTEGRITY_AUDIT: {
        this.auditForm = new FormGroup({
          auditName: new FormControl(),
          auditDescription: new FormControl(),
          auditConfiguration: new FormGroup({
            treePick: new FormControl(),
            options: new FormControl()
          })
        });
      }
        break;
      case EDataIntegrity.TRUNK_DATA_INTEGRITY_AUDIT: {
        this.auditForm = new FormGroup({
          auditName: new FormControl(),
          auditDescription: new FormControl(),
          auditTrunk: new FormControl()
        });
      }
        break;
      case EDataIntegrity.V52_DATA_INTEGRITY_AUDIT: {
        this.auditForm = new FormGroup({
          auditName: new FormControl(),
          auditDescription: new FormControl(),
          auditV52: new FormControl()
        });
      }
        break;
      case EDataIntegrity.SMALL_LINE_DATA_INTEGRITY_AUDIT: {
        this.auditForm = new FormGroup({
          auditName: new FormControl(),
          auditDescription: new FormControl(),
          auditSmallLine: new FormControl()
        });
      }
        break;
      default: {
        this.auditForm = new FormGroup({
          auditName: new FormControl(),
          auditDescription: new FormControl()
        });
      }
        break;
    }
    this.cdr.detectChanges();
    this.getFormFieldAuditName?.setValue(item);
  }

  setStateButtonSave() {
    return this.invalidScheduleToSave || this.invalidConfigurationToSave;
  }

  saveDataAudit() {
    if (this.setStateButtonSave() === false) {
      const bodyData: IAuditConfig | undefined = this.scheduleForLaterComponent?.getBodyDataSchedule();
      if (bodyData === undefined) {
        return;
      }
      const granularAuditData = this.auditUtilitiesService.getGranularAuditData(this.auditForm);
      bodyData.granularAuditData = granularAuditData;
      this.isInprocess = true;
      this.auditService.postAuditConfiguration(this.getFormFieldAuditName?.value, bodyData).subscribe({
        next: () => {
          this.isInprocess = false;
          this.commonService.showSuccessMessage(
            this.translateResults.AUDIT.MESSAGE.UPDATE_AUDIT_SCHEDULE_SUCCESSFULLY
          );
          this.doRefreshDataTable();
        },
        error: (errorAuditConfiguration) => {
          this.isInprocess = false;
          this.commonService.showAPIError(errorAuditConfiguration);
        }
      });
    }
  }

  handleAcceptDelete(event: boolean) {
    this.confirmDelete.isShowConfirmDialog = false;
    if (event) {
      if (this.confirmDelete.data && this.confirmDelete.data.scheduleDefault) {
        const bodyData = { ...this.confirmDelete.data.scheduleDefault };
        bodyData.enabled = false;
        this.isInprocess = true;
        this.auditService.postAuditConfiguration(this.confirmDelete.data.auditType, bodyData).subscribe({
          next: () => {
            this.isInprocess = false;
            this.commonService.showSuccessMessage(
              this.translateResults.AUDIT.MESSAGE.DELETE_AUDIT_SCHEDULE_SUCCESSFULLY
            );
            this.doRefreshDataTable();
          },
          error: (errorAuditConfiguration) => {
            this.isInprocess = false;
            this.commonService.showAPIError(errorAuditConfiguration);
          }
        });
      }
    }
    this.confirmDelete.data = undefined;
  }

  showConfirmDelete(row: IScheduledAudit) {
    this.confirmDelete.content = this.translateResults.AUDIT.MESSAGE.CONFIRM_DELETE_SCHEDULED_AUDIT
      .replace(/{{auditName}}/, row.auditType);
    this.confirmDelete.data = row;
    this.confirmDelete.isShowConfirmDialog = true;
  }

  handleChangeGranularAuditData(
    event: { auditName: string, granularAudit: IGranularAuditData, scheduleDefault: IAuditConfig }
  ) {
    this.auditSubjectService.granularAuditDataChangeSubject.next(event);
  }

  setRowEditSelected(value: IScheduledAudit | undefined) {
    this.rowEditSelected = value;
    this.cdr.detectChanges();
  }

  handleStatusConfigurationToSave(event: boolean) {
    this.invalidConfigurationToSave = event;
    this.cdr.detectChanges();
  }

  handleStatusScheduleToSave(event: boolean) {
    this.invalidScheduleToSave = event;
    this.cdr.detectChanges();
  }

  handleClickCancel() {
    this.rowEditSelected = undefined;
  }
}
