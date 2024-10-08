import { TestBed } from '@angular/core/testing';

import { MaintenanceTriggerService } from './maintenance-trigger.service';

describe('MaintenanceTriggerService', () => {
  let service: MaintenanceTriggerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MaintenanceTriggerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
