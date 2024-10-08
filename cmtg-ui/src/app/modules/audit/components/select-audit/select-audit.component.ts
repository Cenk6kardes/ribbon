import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable, Subscription, interval } from 'rxjs';
import { finalize, startWith } from 'rxjs/operators';
import moment from 'moment-timezone';

import { StorageService } from 'src/app/services/storage.service';
import { AuditService } from '../../services/audit.service';
import { CommonService } from 'src/app/services/common.service';
import { TranslateInternalService } from 'src/app/services/translate-internal.service';
import {
  EDataIntegrity, ERunAuditSumary, IGranularAuditData, IAuditSumary,
  IConfirmRunAudit, IPutAudit, IAuditConfig,
  CInitAuditProcessTitle, COptionsLineDataIntegrity, IGranularAuditDataOfAudit, EScheduleType
} from '../../models/audit';
import { AuditUtilitiesService } from '../../services/audit-utilities.service';
import { IPageHeader } from 'rbn-common-lib';
import { PREFIX_URL } from 'src/app/types/const';
import { AuditSubjectService } from '../../services/audit-subject.service';
import { ScheduleForLaterComponent } from './schedule-for-later/schedule-for-later.component';

@Component({
  selector: 'app-select-audit',
  templateUrl: './select-audit.component.html',
  styleUrls: ['./select-audit.component.scss'],
  providers: [AuditSubjectService]
})
export class SelectAuditComponent implements OnInit, OnDestroy {
  @ViewChild('templateScheduleForLater', { static: false }) templateScheduleForLater: ScheduleForLaterComponent;

  typeDataIntegrity: string;
  scheduleDefaultValue: IAuditConfig | undefined;
  auditForm: FormGroup;
  confirmRunAudit: IConfirmRunAudit = {
    title: '',
    content: '',
    isShowConfirmDialog: false,
    titleAccept: '',
    titleReject: '',
    hideReject: false,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    handleAccept: (isAccept: boolean) => { }
  };
  isInprocess = false;

  translateResults: any;
  auditProcessBarSubscription: Subscription;
  auditSummary: IAuditSumary = {
    showAuditSummary: false,
    auditName: '',
    progressBarData: {
      proportionProgressBar: 0,
      auditProcessTitle: '',
      completed: -1
    },
    summary: [
      { label: ERunAuditSumary.STATE, value: '' },
      { label: ERunAuditSumary.START_TIME, value: '' },
      { label: ERunAuditSumary.END_TIME, value: '' },
      { label: ERunAuditSumary.TOTAL_TIME, value: '' },
      { label: ERunAuditSumary.PROBLEM_FOUND, value: '' }
    ]
  };
  userIDData = '';
  hostData = '';
  headerData: IPageHeader;
  lineDataIntegrityConfig = {
    integrityAuditDefault: false
  };
  isSessionServerConnected = true;
  invalidScheduleToSave = false;
  invalidConfigurationToSave = false;
  invalidScheduleToRun = false;
  invalidConfigurationToRun = false;
  showBtnRun = true;
  showBtnSave = true;
  isShowedMessageAbortAudit = false;
  auditTimeFormat = 'ddd MMM DD YYYY HH:mm:ss [GMT]ZZ';


  constructor(
    private auditService: AuditService,
    private cdr: ChangeDetectorRef,
    private translateInternalService: TranslateInternalService,
    private commonService: CommonService,
    private storageService: StorageService,
    private auditUtilitiesService: AuditUtilitiesService,
    private route: ActivatedRoute,
    private router: Router,
    public auditSubjectService: AuditSubjectService) {
    this.translateResults = this.translateInternalService.translateResults;
  }

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

  ngOnInit(): void {
    this.initPageHeader();
    this.userIDData = this.storageService.userID;
    this.hostData = this.storageService.hostName;
    this.auditForm = new FormGroup({
      auditName: new FormControl(),
      auditDescription: new FormControl()
    });
    const snapshotData = this.route.snapshot.data;
    if (snapshotData && snapshotData['data']) {
      this.typeDataIntegrity = snapshotData['data'].auditDataIntegrity.type;
      const stateUrlAudit = snapshotData['data'].auditDataIntegrity.stateUrl;
      const indexAudit = this.auditUtilitiesService.itemsSideBarAudit.findIndex(n => n.path.includes(stateUrlAudit));
      if (indexAudit === -1) {
        this.router.navigate([PREFIX_URL + '/gateway-controllers']);
        this.commonService.showErrorMessage(
          this.translateResults.AUDIT.MESSAGE.ERROR_PERMISSION_ACCESS_PAGE
            .replace(/{{pageName}}/, this.typeDataIntegrity)
        );
        return;
      }
      this.headerData.title = this.typeDataIntegrity;
      this.cdr.detectChanges();
      this.handleChangeAudit(this.typeDataIntegrity);
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
    this.doGetDescription(item);
    this.getAuditConfigurationByConditions();
  }

  doGetDescription(auditName: string) {
    this.auditService.getDescription(auditName).subscribe({
      next: (res) => {
        this.getFormFieldAuditDescription?.setValue(res);
      },
      error: (errorDescription) => {
        this.commonService.showAPIError(errorDescription);
      }
    });
  }

  checkRunningAudit() {
    this.auditService.getRunningAudit().subscribe({
      next: (res) => {
        if (res.length > 0) {
          this.confirmRunAudit.title = this.translateResults.AUDIT.HEADER.WARNING;
          this.confirmRunAudit.titleAccept = this.translateResults.COMMON.OK;
          this.confirmRunAudit.titleReject = this.translateResults.COMMON.CANCEL;
          this.confirmRunAudit.content = '';
          this.confirmRunAudit.hideReject = true;
          res.map((item) => {
            const info = item.split(';');
            this.confirmRunAudit.content += this.translateResults.AUDIT.MESSAGE.RUNNING_IN_PROGRESS_INFO
              .replace(/{{auditName}}/, info[0])
              .replace(/{{timeStart}}/, info[1])
              .replace(/{{userInfo}}/, info[2])
              .replace(/{{host}}/, info[3]);
          });
          this.confirmRunAudit.content += this.translateResults.AUDIT.MESSAGE.PLEASE_TRY_IT_LATER;
          this.confirmRunAudit.isShowConfirmDialog = true;
          this.confirmRunAudit.handleAccept = (isAccept: boolean) => this.confirmRunAudit.isShowConfirmDialog = false;
        } else {
          this.processAudit(true);
        }
      },
      error: (errorRunningAudit) => {
        this.commonService.showAPIError(errorRunningAudit);
      }
    });
  }

  doPutAudit(): Observable<IPutAudit> {
    const granularAuditData: IGranularAuditData = this.auditUtilitiesService.getGranularAuditData(this.auditForm);
    const name = this.getFormFieldAuditName?.value;
    return this.auditService.putAudit(name, this.userIDData, this.hostData, granularAuditData);
  }

  processAudit(event: boolean) {
    this.confirmRunAudit.isShowConfirmDialog = false;
    if (event) {
      const auditName = this.getFormFieldAuditName?.value;
      this.auditService.getPreparationForAudit(auditName).subscribe({
        next: (res) => {
          if (res === 'true' || res === true) {
            this.auditService.getAuditState(auditName).subscribe({
              next: (resAuditState) => {
                this.auditSummary.showAuditSummary = true;
                this.auditSummary.auditName = auditName;
                this.auditSummary.progressBarData = {
                  proportionProgressBar: resAuditState.completed,
                  auditProcessTitle: resAuditState.auditProcess === CInitAuditProcessTitle ? '' : resAuditState.auditProcess,
                  completed: resAuditState.completed
                };
                this.updateSummary(
                  {
                    state: this.translateResults.AUDIT.MESSAGE.IN_PROCESS,
                    startTime: this.commonService.getCurrentTime(this.auditTimeFormat)
                  }
                );
                let isHasErrorPutAudit = false;
                this.doPutAudit().subscribe({
                  next: (resPutAudit) => {
                    if (!(resPutAudit.notFoundAuditName)) {
                      const tempSummary = {
                        state: this.translateResults.AUDIT.MESSAGE.COMPLETED,
                        startTime: this.auditSummary.summary[1].value,
                        endTime: this.commonService.getCurrentTime(this.auditTimeFormat),
                        totalTime: '',
                        problemFound: resPutAudit.numProblemsRecorded === 0 ?
                          this.translateResults.AUDIT.MESSAGE.NO_PROBLEMS_FOUND : resPutAudit.numProblemsRecorded
                      };
                      tempSummary.totalTime = this.getDurationTime(tempSummary.startTime, tempSummary.endTime);
                      this.updateSummary(tempSummary);
                      if (this.auditProcessBarSubscription) {
                        this.auditProcessBarSubscription.unsubscribe();
                      }
                      this.auditSummary.progressBarData = {
                        proportionProgressBar: 100,
                        auditProcessTitle: '',
                        completed: -1
                      };
                    } else {
                      this.commonService.showErrorMessage(this.translateResults.AUDIT.MESSAGE.ERROR_PUT_AUDIT_NAME
                        .replace(/{{auditName}}/, resPutAudit.notFoundAuditName));
                      this.updateSummaryToFailed();
                    }
                  },
                  error: (errorPutAudit) => {
                    this.updateSummaryToFailed();
                    if (this.isShowedMessageAbortAudit === false) {
                      this.commonService.showAPIError(errorPutAudit);
                    }
                    this.isShowedMessageAbortAudit = false;
                    isHasErrorPutAudit = true;
                  }
                });
                // interval
                setTimeout(() => {
                  if (!isHasErrorPutAudit) {
                    this.auditProcessBarSubscription = interval(3000)
                      .pipe(startWith(-1))
                      .subscribe(() => {
                        this.auditService.getAuditState(auditName).subscribe({
                          next: (resAuditStateInterval) => {
                            if (resAuditStateInterval.completed === -1) {
                              if (this.auditProcessBarSubscription) {
                                this.auditProcessBarSubscription.unsubscribe();
                              }
                            } else {
                              this.auditSummary.progressBarData = {
                                proportionProgressBar: resAuditStateInterval.completed,
                                auditProcessTitle: resAuditStateInterval.auditProcess === CInitAuditProcessTitle ? '' :
                                  resAuditStateInterval.auditProcess,
                                completed: resAuditStateInterval.completed
                              };
                            }
                          },
                          error: (errorAuditState2) => {
                            this.updateSummaryToFailed();
                            this.commonService.showAPIError(errorAuditState2);
                          }
                        });
                      });
                  }
                }, 1000);
              },
              error: (errorAuditState1) => {
                this.auditSummary.showAuditSummary = true;
                this.auditSummary.auditName = auditName;
                this.updateSummaryToFailed();
                this.commonService.showAPIError(errorAuditState1);
              }
            });
          } else {
            this.commonService.showErrorMessage(this.translateResults.AUDIT.MESSAGE.PREPARATION_AUDIT_FAILED);
          }
        },
        error: (errorPreparationForAudit) => {
          this.commonService.showAPIError(errorPreparationForAudit);
        }
      });
    }
  }

  showConfirmAbort(event: boolean) {
    if (event) {
      this.confirmRunAudit.isShowConfirmDialog = true;
      this.confirmRunAudit.title = this.translateResults.AUDIT.HEADER.ABORT_AUDIT;
      this.confirmRunAudit.content = this.translateResults.AUDIT.MESSAGE.CONFIRM_ABORT_AUDIT
        .replace(/{{auditName}}/, this.auditSummary.auditName);
      this.confirmRunAudit.hideReject = false;
      this.confirmRunAudit.titleAccept = this.translateResults.COMMON.YES;
      this.confirmRunAudit.titleReject = this.translateResults.COMMON.NO;
      this.confirmRunAudit.handleAccept = (isAccept: boolean) => this.handleAbort(isAccept);
    } else {
      this.auditSummary.showAuditSummary = false;
      // reset audit summary
      const dataUpdate = {
        state: '',
        startTime: '',
        endTime: '',
        totalTime: '',
        problemFound: ''
      };
      this.updateSummary(dataUpdate);
    }
  }

  showConfirmRunAuditNow(event: boolean) {
    if (event) {
      this.confirmRunAudit.isShowConfirmDialog = true;
      this.confirmRunAudit.title = this.translateResults.AUDIT.HEADER.RUN_AUDIT;
      this.confirmRunAudit.content = this.translateResults.AUDIT.MESSAGE.CONFIRM_RUN_AUDIT_NOW;
      this.confirmRunAudit.hideReject = false;
      this.confirmRunAudit.titleAccept = this.translateResults.COMMON.YES;
      this.confirmRunAudit.titleReject = this.translateResults.COMMON.NO;
      this.confirmRunAudit.handleAccept = (isAccept: boolean) => this.handleRunAuditNow(isAccept);
    }
  }

  handleRunAuditNow(event: boolean) {
    this.confirmRunAudit.isShowConfirmDialog = false;
    if (event) {
      this.checkRunningAudit();
    }
  }

  handleAbort(event: boolean) {
    if (event) {
      this.confirmRunAudit.isShowConfirmDialog = false;
      const auditName = this.getFormFieldAuditName?.value;
      if (this.auditSummary.progressBarData.proportionProgressBar === 100) {
        this.commonService.showErrorMessage(
          this.translateResults.AUDIT.MESSAGE.CAN_NOT_ABORT
        );
        return;
      }
      this.auditService.getRunningAudit().subscribe({
        next: (res) => {
          if (res.length > 0) {
            const abortingAudit = res.find((item) => {
              const info = item.split(';');
              if (info[0] === auditName) {
                return true;
              } else {
                return false;
              }
            });
            if (abortingAudit) {
              const info = abortingAudit.split(';');
              const body = `${info[0]};${info[1].replace(/Started at:/, '')}`;
              this.auditService.postAudit(this.userIDData, body).subscribe({
                next: () => {
                  this.isShowedMessageAbortAudit = true;
                  this.commonService.showSuccessMessage(
                    this.translateResults.AUDIT.MESSAGE.AUDIT_ABORTED
                      .replace(/{{auditName}}/, auditName)
                      .replace(/{{userIDData}}/, this.userIDData)
                  );
                  this.updateSummaryToFailed();
                },
                error: (errorPostAudit) => {
                  this.commonService.showAPIError(errorPostAudit);
                }
              });
            }
          }
        },
        error: (errorRunningAudit) => {
          this.commonService.showAPIError(errorRunningAudit);
        }
      });
    } else {
      this.confirmRunAudit.isShowConfirmDialog = false;
    }
  }

  updateSummary(dataUpdate: {
    state?: string, startTime?: moment.Moment | string,
    endTime?: moment.Moment | string, totalTime?: string,
    problemFound?: string
  }) {
    if (dataUpdate.state !== undefined) {
      this.auditSummary.summary[0].value = dataUpdate.state;
    }
    if (dataUpdate.startTime !== undefined) {
      this.auditSummary.summary[1].value = dataUpdate.startTime;
    }
    if (dataUpdate.endTime !== undefined) {
      this.auditSummary.summary[2].value = dataUpdate.endTime;
    }
    if (dataUpdate.totalTime !== undefined) {
      this.auditSummary.summary[3].value = dataUpdate.totalTime;
    }
    if (
      this.typeDataIntegrity === EDataIntegrity.LINE_DATA_INTEGRITY_AUDIT ||
      this.typeDataIntegrity === EDataIntegrity.TRUNK_DATA_INTEGRITY_AUDIT
    ) {
      this.auditSummary.summary[4].value = undefined;
    } else if (dataUpdate.problemFound !== undefined) {
      this.auditSummary.summary[4].value = dataUpdate.problemFound;
    }
    this.auditSummary.summary = [...this.auditSummary.summary];
  }

  updateSummaryToFailed() {
    if (this.auditProcessBarSubscription) {
      this.auditProcessBarSubscription.unsubscribe();
    }
    this.auditSummary.progressBarData = {
      proportionProgressBar: 100,
      auditProcessTitle: this.translateResults.AUDIT.MESSAGE.AUDIT_PROCESS_FAILED,
      completed: 0
    };
    const tempSummary = {
      state: this.translateResults.AUDIT.MESSAGE.FAILED_TO_RUN,
      startTime: this.auditSummary.summary[1].value ?
        this.auditSummary.summary[1].value : this.commonService.getCurrentTime(this.auditTimeFormat),
      endTime: this.commonService.getCurrentTime(this.auditTimeFormat),
      totalTime: '',
      problemFound: this.auditSummary.summary[4].value !== '' ? this.auditSummary.summary[4].value : ''
    };
    tempSummary.totalTime = this.getDurationTime(tempSummary.startTime, tempSummary.endTime);
    this.updateSummary(tempSummary);
  }

  getDurationTime(startTime: string, endTime: string) {
    const momentStartTime = moment(startTime, this.auditTimeFormat);
    const momentEndTime = moment(endTime, this.auditTimeFormat);
    return momentEndTime.diff(momentStartTime, 'seconds') + ' ' + 'seconds';
  }

  handleChangeGranularAuditData(event: IGranularAuditDataOfAudit | undefined) {
    this.auditSubjectService.granularAuditDataChangeSubject.next(event);
  }

  getAuditConfigurationByConditions() {
    if (this.getFormFieldAuditName?.value === EDataIntegrity.C20_DATA_INTEGRITY_AUDIT) {
      this.isInprocess = true;
      this.auditService.getSessionServerConnected().pipe(
        finalize(() => {
          this.isInprocess = false;
          this.doGetAuditConfiguration();
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
      this.doGetAuditConfiguration();
    }
  }

  doGetAuditConfiguration() {
    this.scheduleDefaultValue = undefined;
    const name = this.getFormFieldAuditName?.value || '';
    this.isInprocess = true;
    this.cdr.detectChanges();
    this.auditService.getAuditConfiguration(name).subscribe({
      next: (rs) => {
        const configurationResponse = rs.data;
        this.isInprocess = false;
        const scheduledAvailable = this.auditUtilitiesService.isScheduledAuditAvailable(configurationResponse);
        if (scheduledAvailable) {
          this.scheduleDefaultValue = configurationResponse;
          this.cdr.detectChanges();
          this.handleChangeGranularAuditData(
            {
              auditName: name,
              granularAudit: this.scheduleDefaultValue.granularAuditData,
              scheduleDefault: this.scheduleDefaultValue
            }
          );
        } else {
          this.handleChangeGranularAuditData(undefined);
        }
      },
      error: (errorConfiguration) => {
        this.isInprocess = false;
        this.commonService.showAPIError(errorConfiguration);
      }
    });
  }

  doSaveDataAudit() {
    const bodyData: IAuditConfig | undefined = this.templateScheduleForLater?.getBodyDataSchedule();
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
        const configurationOptions = this.getFormFieldAuditConfigurationOptions?.value;
        this.lineDataIntegrityConfig.integrityAuditDefault = configurationOptions?.indexOf(COptionsLineDataIntegrity[0].value) > -1;
        this.getAuditConfigurationByConditions();
      },
      error: (errorAuditConfiguration) => {
        this.isInprocess = false;
        this.commonService.showAPIError(errorAuditConfiguration);
      }
    });
  }

  initPageHeader() {
    this.headerData = {
      title: this.translateResults.AUDIT.TITLE,
      topButton: {
        label: this.translateResults.AUDIT.FIELD_LABEL.REPORTS,
        title: this.translateResults.AUDIT.FIELD_LABEL.REPORTS,
        onClick: () => {
          this.router.navigate(['./reports'], { relativeTo: this.route });
        },
        isDisplay: true
      }
    };
  }

  handleStatusConfigurationToSave(event: boolean) {
    this.invalidConfigurationToSave = event;
    this.cdr.detectChanges();
  }

  handleStatusConfigurationToRun(event: boolean) {
    this.invalidConfigurationToRun = event;
    this.cdr.detectChanges();
  }

  handleStatusScheduleToSave(event: boolean) {
    this.invalidScheduleToSave = event;
    this.cdr.detectChanges();
  }

  handleEvOnChangesScheduleType(event: string) {
    if (event === EScheduleType.Now) {
      this.showBtnRun = true;
      this.showBtnSave = false;
    } else {
      this.showBtnRun = false;
      this.showBtnSave = true;
    }
  }

  ngOnDestroy() {
    if (this.auditProcessBarSubscription) {
      this.auditProcessBarSubscription.unsubscribe();
    }
  }
}
