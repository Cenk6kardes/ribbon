import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { PREFIX_URL } from '../types/const';

import { PreferencesService } from './preferences.service';
import { StorageService } from './storage.service';
import { CommonService } from './common.service';
import { IPreferences } from '../types';

describe('PreferencesService', () => {
  let service: PreferencesService;
  let preferences: IPreferences | null;
  const commonService = jasmine.createSpyObj('commonService', {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    showWarnMessage: () => {}, clearToastMessage: () => {}
  });
  const storageService = jasmine.createSpyObj('storageService', ['']);
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

    preferences = {
      refresh: { checked: true, second: 10 },
      termination: { checked: true, hour: 0, minute: 10 },
      cpdRequest: false
    };
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call handlePreferencesStorage', () => {
    storageService.preferences = preferences;
    service.handlePreferencesStorage();
    expect(service.preferences).toEqual(preferences);

    storageService.preferences = null;
    service.handlePreferencesStorage();
    expect(service.preferences).toEqual(preferences);
  });

  it('should call startWithCondition', () => {
    spyOn(service, 'startAutoTermiation');
    spyOn(service, 'startAutoRefresh');
    router.url = PREFIX_URL + '/home';
    service.startWithCondition();
    expect(service.startAutoTermiation).toHaveBeenCalled();
    expect(service.startAutoRefresh).toHaveBeenCalled();
  });

  it('should call startAutoRefresh with time interval = 0', () => {
    spyOn(service, 'getPreferencesRefreshTime').and.returnValue(0);
    service.startAutoRefresh();
    expect(commonService.showWarnMessage).toHaveBeenCalled();
  });

  it('should call startAutoRefresh with interval > 0', fakeAsync(() => {
    spyOn(service.autoRefreshEmit$, 'next');
    spyOn(service, 'getPreferencesRefreshTime').and.returnValue(1000);
    service.startAutoRefresh();
    tick(1000);
    service.autoTerminationEmit$.next();
    expect(service.autoRefreshEmit$.next).toHaveBeenCalledWith(true);
  }));

  it('should call startAutoTermiation', fakeAsync(() => {
    spyOn(service.autoTerminationEmit$, 'next');
    spyOn(service, 'getPreferencesTermiationTime').and.returnValue(1000);
    service.startAutoTermiation();
    tick(1000);
    service.autoTerminationEmit$.next();
    expect(service.autoTerminationEmit$.next).toHaveBeenCalled();
    expect(commonService.showWarnMessage).toHaveBeenCalled();
  }));

  it('should call stopAutoRefresh', () => {
    service.stopAutoRefresh();
    expect(service.preferences).toEqual(null);
  });

  it('should call getPreferencesCPDRequest', () => {
    spyOn(service, 'checkPreferences');
    service.getPreferencesCPDRequest();
    expect(service.checkPreferences).toHaveBeenCalled();
  });

  it('should call getPreferencesRefreshTime', () => {
    spyOn(service, 'checkPreferences');
    service.preferences = preferences;
    service.getPreferencesRefreshTime();
    expect(service.checkPreferences).toHaveBeenCalled();
  });

  it('should call getPreferencesTermiationTime', () => {
    spyOn(service, 'checkPreferences');
    service.preferences = preferences;
    service.getPreferencesTermiationTime();
    expect(service.checkPreferences).toHaveBeenCalled();
  });

  it('should call checkPreferences', () => {
    service.preferences = null;
    service.checkPreferences();
    expect(service.preferences).toEqual(storageService.preferences);
  });
});
