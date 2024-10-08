import { TestBed } from '@angular/core/testing';

import { MaintTrunkClliService } from './maint-trunk-clli.service';

describe('MaintTrunkClliService', () => {
  let service: MaintTrunkClliService;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MaintTrunkClliService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should handle table data with an array of items', () => {
    const testData = [
      { Error: { Message: 'Error 1' } },
      { State: 'MB' },
      { Error: { Message: 'Error 2' } }
    ];
    service.handleTableData(testData);
    service.tableCols.subscribe((data) => {
      expect(data.trunkResponse.length).toBe(3);
      expect(data.trunkResponse[0]['State']).toBe('Error 1');
      expect(data.trunkResponse[1]['State']).toBe('MB');
      expect(data.trunkResponse[2]['State']).toBe('Error 2');
    });
  });

  it('should handle table data with a single item Error', () => {
    const testData = { Error: { Message: 'Single Error' } };
    service.handleTableData(testData);
    service.tableCols.subscribe((data) => {
      expect(data.trunkResponse.length).toBe(1);
      expect(data.trunkResponse[0]['State']).toBe('Single Error');
    });
  });

  it('should handle table data with a single item not Error', () => {
    const testData = { State: 'MB' };
    service.handleTableData(testData);
    service.tableCols.subscribe((data) => {
      expect(data.trunkResponse.length).toBe(1);
      expect(data.trunkResponse[0]['State']).toBe('MB');
    });
  });

  it('should handle empty table data', () => {
    service.handleTableData('');
    service.tableCols.subscribe((data) => {
      expect(data.trunkResponse.length).toBe(0);
    });
  });

  it('should handle undefined table data', () => {
    service.handleTableData(undefined);
    service.tableCols.subscribe((data) => {
      expect(data.trunkResponse.length).toBe(0);
    });
  });
});
