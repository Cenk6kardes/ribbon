import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { interval, Subject, Subscription } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { PREFIX_URL } from '../types/const';
import { StorageService } from './storage.service';
import { CommonService } from './common.service';
import { IPreferences } from '../types';

@Injectable({
  providedIn: 'root'
})
export class PreferencesService {
  autoRefreshEmit$ = new Subject<boolean>();
  autoTerminationEmit$ = new Subject<void>();
  runAutoRefresh$ = new Subject<boolean>();

  subscriptionRefresh$: Subscription;
  subscriptionAutoTermination$: Subscription;

  preferences: IPreferences | null = null;

  defaultPreferences: IPreferences = {
    refresh: {
      checked: true,
      second: 10
    },
    termination: {
      checked: true,
      hour: 0,
      minute: 10
    },
    cpdRequest: false
  };

  constructor(
    private storageService: StorageService,
    private commonService: CommonService,
    private router: Router
  ) { }

  handlePreferencesStorage(): IPreferences {
    let preferences = this.storageService.preferences;
    if (preferences) {
      this.preferences = preferences;
    } else {
      preferences = this.defaultPreferences;
      this.storageService.preferences = this.defaultPreferences;
    }
    return preferences;
  }

  startWithCondition() {
    this.startAutoTermiation();
    if (this.router.url.includes(PREFIX_URL + '/home')) {
      // Trigger to start auto refresh if current page is Home screen
      this.startAutoRefresh();
    }
  }

  startAutoRefresh(showWarningOff = true) {
    this.subscriptionRefresh$?.unsubscribe();
    const timeInterval = this.getPreferencesRefreshTime();
    if (!timeInterval) {
      this.runAutoRefresh$.next(false);
      if (showWarningOff) {
        this.showAutoRefreshWarning();
      }
    } else {
      this.runAutoRefresh$.next(true);
      this.subscriptionRefresh$ = interval(timeInterval)
        .pipe(takeUntil(this.autoTerminationEmit$))
        .subscribe(() => {
          this.autoRefreshEmit$.next(true);
        });
    }
  }

  startAutoTermiation() {
    this.subscriptionAutoTermination$?.unsubscribe();
    const timeInterval = this.getPreferencesTermiationTime();
    if (!timeInterval) {
      return;
    }
    this.subscriptionAutoTermination$ = interval(timeInterval)
      .pipe(
        takeUntil(this.autoTerminationEmit$),
        take(1)
      )
      .subscribe(() => {
        this.autoTerminationEmit$.next();
        this.showAutoRefreshWarning();
        this.stopAutoRefresh();
      });
  }

  stopAutoRefresh() {
    this.autoRefreshEmit$.next(false);
    this.subscriptionRefresh$?.unsubscribe();
    this.runAutoRefresh$.next(false);
    this.preferences = null;
  }

  getPreferencesCPDRequest() {
    this.checkPreferences();
    return this.preferences ? this.preferences.cpdRequest : false;
  }

  getPreferencesRefreshTime(): number {
    this.checkPreferences();
    let time = 0;
    if (this.preferences) {
      time = this.preferences.refresh.checked ? this.preferences.refresh.second : 0;
    }
    return time * 1000;
  }

  getPreferencesTermiationTime(): number {
    this.checkPreferences();
    let time = 0;
    if (this.preferences && this.preferences.termination.checked
      && (this.preferences.refresh.checked || this.preferences.cpdRequest) ) {
      time = (this.preferences.termination.hour * 3600) + (this.preferences.termination.minute * 60);
    }
    return time * 1000;
  }

  checkPreferences() {
    if (!this.preferences) {
      this.preferences = this.storageService.preferences;
    }
  }

  showAutoRefreshWarning() {
    this.commonService.clearToastMessage();
    this.commonService.showWarnMessage('Auto refresh is turned off');
  }
}
