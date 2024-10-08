import { EventEmitter, Injectable, OnDestroy } from '@angular/core';
import { interval, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { StorageService } from './storage.service';
import { CommonService } from './common.service';
import { IPreferences } from '../types';

@Injectable({
  providedIn: 'root'
})
export class PreferencesService {
  autoRefreshEmit = new EventEmitter();
  autoRefreshSubscription: Subscription;

  defaultPreferences: IPreferences = {
    refresh: {
      checked: true,
      second: 10
    },
    confirmation: {
      checked: true
    }
  };

  constructor(
    private storageService: StorageService,
    private commonService: CommonService
  ) { }

  getPreferences(): IPreferences {
    let preferences = this.storageService.preferences;
    if (!preferences) {
      preferences = this.defaultPreferences;
      this.storageService.preferences = this.defaultPreferences;
    }
    return preferences;
  }

  doAutoRefresh() {
    const timeInterval = this.getPreferencesRefreshTime();
    if (!timeInterval) {
      this.showAutoRefreshWarning();
      this.stopAutoRefresh();
    } else {
      this.stopAutoRefresh();
      this.autoRefreshSubscription = interval(timeInterval)
        .subscribe(() => {
          this.autoRefreshEmit.emit();
        });
    }
  }

  stopAutoRefresh() {
    if (this.autoRefreshSubscription) {
      this.autoRefreshSubscription.unsubscribe();
    }
  }

  getPreferencesRefreshTime(): number {
    let time = 0;
    const preferences = this.getPreferences();
    if (preferences) {
      if (preferences.refresh.checked) {
        time = preferences.refresh.second;
      }
    }
    return time * 1000;
  }

  showAutoRefreshWarning() {
    this.commonService.clearToastMessage();
    this.commonService.showWarnMessage('Auto refresh is turned off');
  }
}
