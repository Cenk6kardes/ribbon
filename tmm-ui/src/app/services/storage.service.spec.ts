import { TestBed } from '@angular/core/testing';

import { StorageService } from './storage.service';
import { IPreferences } from '../types';

describe('StorageService', () => {
  let storageService: StorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StorageService]
    });
    storageService = TestBed.inject(StorageService);
  });

  it('should be created', () => {
    expect(storageService).toBeTruthy();
  });

  it('should set and get sessionId', () => {
    const sessionId = 'abc123';
    storageService.sessionId = sessionId;
    expect(storageService.sessionId).toBe(sessionId);
  });

  it('should set and get clli', () => {
    const clli = 'CLLI123';
    storageService.clli = clli;
    expect(storageService.clli).toBe(clli);
  });

  it('should set and get preferences', () => {
    const preferences: IPreferences = {
      refresh: { checked: true, second: 1 },
      confirmation: { checked: true }
    };
    storageService.preferences = preferences;
    expect(storageService.preferences).toEqual(preferences);
  });

  it('should remove storage data', () => {
    storageService.sessionId = 'abc123';
    storageService.clli = 'CLLI123';
    storageService.preferences = {
      refresh: { checked: true, second: 1 },
      confirmation: { checked: true }
    };
    storageService.removeStorageData();
    expect(storageService.sessionId).toBe('');
    expect(storageService.clli).toBe('');
    expect(storageService.preferences).toBeNull();
  });
});
