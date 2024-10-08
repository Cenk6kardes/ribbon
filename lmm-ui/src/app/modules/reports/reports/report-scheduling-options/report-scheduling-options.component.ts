import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { FormToolbarEmit, IPageHeader } from 'rbn-common-lib';

import { TranslateInternalService } from 'src/app/services/translate-internal.service';
import { IQueryConfiguration } from 'src/app/shared/models/line-maintenance-manager';
import { PREFIX_URL } from 'src/app/types/const';
import { ReportService } from '../../services/reports.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-report-scheduling-options',
  templateUrl: './report-scheduling-options.component.html',
  styleUrls: ['./report-scheduling-options.component.scss']
})
export class ReportSchedulingOptionsComponent implements OnInit {

  headerData: IPageHeader;
  formGroup: FormGroup;
  isLoading = false;
  translateResults: any;
  dayGroup: any = [];

  constructor(
    private fb: FormBuilder,
    private translateService: TranslateInternalService,
    private reportService: ReportService,
    private commonService: CommonService,
    private router: Router
  ) {
    this.translateResults = this.translateService.translateResults;
    this.formGroup = this.fb.group({
      enabled: [false],
      daily: [false],
      timetorun: [new Date()],
      day: this.fb.group({
        monday: [false],
        tuesday: [false],
        wednesday: [false],
        thursday: [false],
        friday: [false],
        saturday: [false],
        sunday: [false]
      })
    });
  }

  get day() {
    return this.formGroup.get('day') as FormGroup;
  }

  ngOnInit(): void {
    this.headerData = {
      title: this.translateResults.REPORTS_SCREEN.REPORTS_SCHEDULING_OPTIONS,
      breadcrumb: [{
        label: this.translateResults.REPORTS_SCREEN.REPORTS_TITLE,
        command: () => {
          this.onBack();
        }
      },
      { label: this.translateResults.REPORTS_SCREEN.REPORTS_SCHEDULING_OPTIONS }
      ]
    };
    this.getQueryConfiguration();
  }

  getQueryConfiguration() {
    this.isLoading = true;
    this.dayGroup = Object.keys(this.day?.controls) || [];
    this.reportService.getQueryConfiguration().subscribe((res: any) => {
      if (res) {
        res['day'] = {};
        this.dayGroup.map((key: string) => {
          const tmp = res[key];
          res['day'][key] = tmp;
          delete res[key];
        });
        /* timeToRun doesn't work in formControlName of calendar, because it's using camelCase type,
         so we convert this attribute to lowercase */
        if (res.timeToRun) {
          const newDate = new Date(this.commonService.formatTime(new Date(), 'MM/DD/YYYY') + ' ' + res.timeToRun);
          res.timetorun = newDate;
        }
        this.formGroup.patchValue(res);
      }
      this.isLoading = false;
    }, error => {
      this.isLoading = false;
      this.commonService.showAPIError(error);
    });
  }


  handleDataBeforeSubmit() {
    const newObject: any = {};
    Object.keys(this.formGroup.value).forEach(key => {
      if (key === 'day') {
        Object.keys(this.formGroup.value[key]).map(childKey => {
          newObject[childKey] = this.formGroup.value[key][childKey];
        });
      } else if (key === 'timetorun') {
        newObject['timeToRun'] = this.commonService.formatTime(this.formGroup.value[key], 'HH:mm:ss');
      } else {
        newObject[key] = this.formGroup.value[key];
      }
    });
    return newObject;
  }

  onSave() {
    const requestBody: IQueryConfiguration = this.handleDataBeforeSubmit();
    if (requestBody.timeToRun === 'Invalid date') {
      this.commonService.showErrorMessage(this.translateResults.REPORTS_SCREEN.AT_THE_TIME_Invalid);
      return;
    }
    this.isLoading = true;
    this.reportService.runQueryConfiguration(requestBody).subscribe(() => {
      this.commonService.showSuccessMessage(this.translateResults.REPORTS_SCREEN.UPDATE_REPORT_SUCCESS);
      this.isLoading = false;
      this.onBack();
    }, error => {
      this.isLoading = false;
      this.commonService.showAPIError(error);
    });
  }

  buttonClickedEmit($event: string) {
    if ($event === FormToolbarEmit.primary) {
      this.onSave();
    } else {
      this.onBack();
    }
  }

  onBack() {
    this.router.navigate([PREFIX_URL + '/reports']);
  }

  selectDaily(event: any) {
    Object.keys(this.day.controls).forEach((element: string) => {
      this.day.get(element)?.setValue(event?.checked);
    });
  }

  onCheckboxChange() {
    if (Object.values(this.day.value).includes(false)) {
      this.formGroup.get('daily')?.setValue(false);
    } else {
      this.formGroup.get('daily')?.setValue(true);
    }
  }
}
