import { TestBed } from '@angular/core/testing';

import { StatusIndicatorsService } from './status-indicators.service';

describe('StatusIndicatorsService', () => {
  let service: StatusIndicatorsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StatusIndicatorsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
