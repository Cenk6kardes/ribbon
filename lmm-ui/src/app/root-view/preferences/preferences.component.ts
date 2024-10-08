import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { Subscription } from 'rxjs';
import { SelectItem } from 'primeng/api';

import { PreferencesService } from 'src/app/services/preferences.service';
import { StorageService } from 'src/app/services/storage.service';
import { StatusLogService } from '../../services/status-log.service';
import { IPreferences } from 'src/app/types';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.scss']
})
export class PreferencesComponent implements AfterViewInit, OnInit, OnDestroy {
  @Input() isShowPreferences = false;
  @Output() hidePreferences = new EventEmitter();
  autoTermiationSubscription: Subscription;

  hours: SelectItem[];
  minutes: SelectItem[];
  seconds: SelectItem[];

  isDisabledTermination = false;
  preferences: IPreferences;

  constructor(
    private preferencesService: PreferencesService,
    private storageService: StorageService,
    private statusLogService: StatusLogService
  ) {}

  ngOnInit(): void {
    this.preferences = this.preferencesService.handlePreferencesStorage();
    this.initDropdownOption();
    this.checkTerminationValue();
  }

  ngAfterViewInit(): void {
    this.preferencesService.startAutoTermiation();
    this.autoTermiationSubscription =
      this.preferencesService.autoTerminationEmit$.subscribe(() => {
        if (this.storageService.preferences) {
          this.preferences = JSON.parse(
            JSON.stringify(this.storageService.preferences)
          );
          this.preferences.refresh.checked = false;
          this.preferences.termination.checked = false;
          this.storageService.preferences = this.preferences;
          this.isDisabledTermination = true;
          this.handleLogsOnAutoTermiation();
        }
      });
  }

  initDropdownOption() {
    this.hours = this.setOption(9); // Value from 0~8. Maximum is 480 munites / 60 = 8 hours
    this.minutes = this.setOption(59, 1);

    this.seconds = this.setOption(56, 5); // Value from 5~60
  }

  setOption(length: number, skip?: number): SelectItem[] {
    return Array.from({ length: length }, (_, i) => ({
      label: skip ? (i + skip).toString() : i.toString(),
      value: skip ? i + skip : i
    }));
  }

  handleHourChange() {
    if (this.preferences.termination.hour === 8) {
      // Max is 480 munites ~ 8 hours
      this.preferences.termination.minute = 0;
      this.minutes = this.setOption(1);
    } else if (this.preferences.termination.hour === 0) {
      // Min is 1 minute
      this.minutes = this.setOption(59, 1);
    } else {
      this.minutes = this.setOption(60);
    }
  }

  checkTerminationValue() {
    if (!this.preferences.refresh.checked && !this.preferences.cpdRequest) {
      this.preferences.termination.checked = false;
      this.isDisabledTermination = true;
    } else {
      this.isDisabledTermination = false;
    }
  }

  onShow() {
    this.preferences = this.preferencesService.handlePreferencesStorage();
    this.checkTerminationValue();
  }

  onHide() {
    this.hidePreferences.emit();
  }

  onSave() {
    const oldData = this.storageService.preferences;
    if (oldData) {
      this.handleLogsOnSave(JSON.parse(JSON.stringify(oldData)));
    }
    this.storageService.preferences = this.preferences;

    this.preferencesService.preferences = null;
    this.preferencesService.startWithCondition();
    this.isShowPreferences = false;
  }

  handleLogsOnSave(oldData: IPreferences) {
    if (oldData.refresh.second !== this.preferences.refresh.second) {
      this.statusLogService.pushLogs(
        'VRB: Auto Refresh Rate changed to ' +
          this.preferences.refresh.second +
          ' seconds'
      );
    }
    if (
      oldData.termination.hour !== this.preferences.termination.hour ||
      oldData.termination.minute !== this.preferences.termination.minute
    ) {
      const message =
        'VRB: Auto Termination timeout value changed to ' +
        this.preferences.termination.hour +
        ' hours, ' +
        this.preferences.termination.minute +
        ' minutes';
      this.statusLogService.pushLogs(message);
    }
    if (this.preferences.refresh.checked) {
      // TODO: Need confirm: legacy system always displays VRB: WARNING: refreshRate (5 seconds)
      this.statusLogService.pushLogs(
        'VRB: WARNING: refreshRate (' +
          (this.preferences?.refresh.second || 0) +
          ' seconds)'
      );
      this.statusLogService.pushLogs(
        'VRB: WARNING: The deload function (CPD -> MB) works best with the minimum'
      );
    } else {
      this.statusLogService.pushLogs(
        'VRB: WARNING: Deloading (CPD to MB) disabled when Auto Refresh is turned off.'
      );
    }
    if (this.preferences.cpdRequest) {
      this.statusLogService.pushLogs('VRB: WARNING:CPD disabled.');
    } else {
      this.statusLogService.pushLogs('VRB: WARNING:CPD enabled.');
    }
  }

  handleLogsOnAutoTermiation() {
    this.statusLogService.pushLogs('VRB: Auto Termination timer expired');
    this.statusLogService.pushLogs(
      'VRB: Auto Termination - Auto Refresh disabled'
    );
    this.statusLogService.pushLogs(
      'VRB: WARNING: Deloading (CPD to MB) disabled when Auto Refresh is turned off.'
    );
  }

  ngOnDestroy(): void {
    this.autoTermiationSubscription?.unsubscribe();
  }
}