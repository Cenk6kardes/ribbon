import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { PREFIX_URL } from '../types/const';

import { PreferencesService } from './preferences.service';
import { StorageService } from './storage.service';
import { CommonService } from './common.service';
import { IPreferences } from '../types';

describe('PreferencesService', () => {
  let service: PreferencesService;
  let defaultPreferences: IPreferences;
  const commonService = jasmine.createSpyObj('commonService',['showWarnMessage','clearToastMessage']);
  const storageService = jasmine.createSpyObj('storageService', ['getPreferences']);
  const router = jasmine.createSpyObj('router', ['url']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: CommonService, useValue: commonService },
        { provide: StorageService, useValue: storageService },
        { provide: Router, useValue: router }
      ]
    });
    service = TestBed.inject(PreferencesService);

    defaultPreferences = {
      refresh: { checked: true, second: 10 },
      confirmation: { checked: true }
    };
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be call showAutoRefreshWarning', () => {
    service.showAutoRefreshWarning();
    expect(commonService.clearToastMessage).toHaveBeenCalled();
    expect(commonService.showWarnMessage).toHaveBeenCalledWith('Auto refresh is turned off');
  });

  it('should be call getPreferencesRefreshTime', () => {
    storageService.getPreferences.and.returnValue(defaultPreferences);
    const refreshTime = service.getPreferencesRefreshTime();
    expect(refreshTime).toBe(10000);
  });

  it('should be call stopAutoRefresh', () => {
    service.autoRefreshSubscription = {
      unsubscribe: jasmine.createSpy('unsubscribe')
    } as any;
    service.stopAutoRefresh();
    expect(service.autoRefreshSubscription.unsubscribe).toHaveBeenCalled();
  });

  it('should be call doAutoRefresh if preferences allow auto-refresh', () => {
    spyOn(service,'getPreferencesRefreshTime').and.returnValue(0);
    spyOn(service,'showAutoRefreshWarning');
    spyOn(service,'stopAutoRefresh');
    service.doAutoRefresh();
    expect(service.showAutoRefreshWarning).toHaveBeenCalled();
    expect(service.stopAutoRefresh).toHaveBeenCalled();
  });

  it('should be call doAutoRefresh if auto-refresh is turned off', () => {
    spyOn(service,'getPreferencesRefreshTime').and.returnValue(10000);
    spyOn(service,'stopAutoRefresh');
    service.doAutoRefresh();
    expect(service.stopAutoRefresh).toHaveBeenCalled();
  });
});
