import { TestBed } from '@angular/core/testing';

import { StorageService } from './storage.service';
// import { IDirectoryTable } from '../modules/home/models/home';

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

  it('should set and get cBMgIP', () => {
    const cBMgIP = '192.168.0.1';
    storageService.cBMgIP = cBMgIP;
    expect(storageService.cBMgIP).toBe(cBMgIP);
  });

  it('should set and get clli', () => {
    const clli = 'CLLI123';
    storageService.clli = clli;
    expect(storageService.clli).toBe(clli);
  });

  it('should set and get preferences', () => {
    const preferences: IPreferences = {
      refresh: { checked: true, second: 1 },
      termination: { checked: true, hour: 1, minute: 10 },
      cpdRequest: true
    };
    storageService.preferences = preferences;
    expect(storageService.preferences).toEqual(preferences);
  });

  // it('should set and get tableDNData', () => {
  //   const tableData: IDirectoryTable[] = [{
  //     cm_dn: '123456',
  //     clli: 'CLLI123',
  //     time: '10:00',
  //     cm_line_state: 'active',
  //     endpoint_state: 'endpoint123',
  //     profile: '123',
  //     gw_address: 'gwAddress123',
  //     gw_name: 'name123',
  //     endpoint_name: 'endpoint123',
  //     cm_tid: 'tid123',
  //     cm_gwc_address: 'gwAddress123'
  //   }
  //   ];
  //   storageService.tableDNData = tableData;
  //   expect(storageService.tableDNData).toEqual(tableData);
  // });

  it('should remove storage data', () => {
    storageService.sessionId = 'abc123';
    storageService.cBMgIP = '192.168.0.1';
    storageService.clli = 'CLLI123';
    storageService.preferences = {
      refresh: { checked: true, second: 1 },
      termination: { checked: true, hour: 1, minute: 10 },
      cpdRequest: true
    };
    /* storageService.tableDNData = [{
      cm_dn: '123456',
      clli: 'CLLI123',
      time: '10:00',
      cm_line_state: 'active',
      endpoint_state: 'endpoint123',
      profile: '123',
      gw_address: 'gwAddress123',
      gw_name: 'name123',
      endpoint_name: 'endpoint123',
      cm_tid: 'tid123',
      cm_gwc_address: 'gwAddress123'
    }];*/
    storageService.removeStorageData();
    expect(storageService.sessionId).toBe('');
    expect(storageService.cBMgIP).toBe('');
    expect(storageService.clli).toBe('');
    expect(storageService.preferences).toBeNull();
    // expect(storageService.tableDNData).toEqual([]);
  });
});
