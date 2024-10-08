import { TestBed } from '@angular/core/testing';

import { DirectoryService } from './directory.service';
import { StorageService } from 'src/app/services/storage.service';
import { StatusLogService } from 'src/app/services/status-log.service';
import { CommonService } from 'src/app/services/common.service';
import { EDirectoryValue } from '../models/home';

describe('DirectoryService', () => {
  let service: DirectoryService;
  const storageService = jasmine.createSpyObj('storageService', [
    'tableDNData '
  ]);
  storageService.tableDNData = [];
  const statusLogService = jasmine.createSpyObj('statusLogService', [
    'pushLogs'
  ]);

  const rowData = {
    cm_dn: '1038831001',
    clli: 'CO24',
    time: '14:17:12',
    cm_line_state: 'MB',
    endpoint_state: 'OK, ON-HOOK, POTS_TERM',
    profile: 'TOUCHTONE',
    gw_address: '47.168.139.99',
    endpoint_name: 'aaln/6',
    cm_tid: '46.0.1',
    cm_gwc_address: '10.254.146.140',
    gw_name: 'co24mediatrix1124'
  };

  const commonService = jasmine.createSpyObj('commonService', [
    'showErrorMessage',
    'getCurrentTime'
  ]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: StorageService, useValue: storageService },
        { provide: CommonService, useValue: commonService },
        { provide: StatusLogService, useValue: statusLogService }
      ]
    });
    service = TestBed.inject(DirectoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should call storeDataTableStorage', () => {
    service.storeDataTableStorage([rowData]);
    expect(storageService.tableDNData[0].cm_dn).toBe('1038831001');
  });

  it('should call restoreDataTableFromStorage', () => {
    storageService.tableDNData = [];
    service.restoreDataTableFromStorage();
    expect(service.dataTable.length).toBe(0);
  });

  it('should call handleRowData case update row', () => {
    service.dataTable = [rowData];
    service.handleRowData(rowData);
    expect(service.dataTable[0]).toEqual(rowData);
  });

  it('should call handleRowData case add row', () => {
    service.dataTable = [rowData];
    const rowCopy = JSON.parse(JSON.stringify(rowData));
    rowCopy.cm_dn = '1038831002';
    service.handleRowData(rowCopy);
    expect(service.dataTable.length).toEqual(2);
  });

  it('should call handleRowWhenCMRCInvalid', () => {
    commonService.getCurrentTime.and.returnValue('11:26:29');
    service.dataTable = [rowData];
    service.handleRowWhenCMRCInvalid('1038831001');
    expect(service.dataTable[0].cm_line_state).toBe(EDirectoryValue.NOT_AVAILABLE);
    expect(service.dataTable[0].endpoint_state).toBe(EDirectoryValue.NOT_AVAILABLE);
  });

  it('should call formatEndpointStateValue', () => {
    const test = service.formatEndpointStateValue({epState: '1', epCallState: '2', epTerminalType: '3'});
    expect(test).toBe('1, 2, 3');
  });

  it('should call formatLineRequest', () => {
    const param = {
      cm_clli: 'clli',
      cm_dn: 'cm_dn',
      gw_name: 'gw_name',
      gw_address: 'gw_address',
      endpoint_name: 'endpoint_name'
    };
    const test = service.formatLineRequest(param);
    expect(test.cm_tid).toBe('cm_dn');
  });

  it('should delete row when CMRC_2 is provided', () => {
    service.dataTable = [rowData];
    const initialLength = service.dataTable.length;
    service.deleteRowWhenCMRC_2(rowData.cm_dn);
    expect(service.dataTable.length).toBe(initialLength - 1);
  });

});
