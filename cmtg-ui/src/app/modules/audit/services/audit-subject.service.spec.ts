import { TestBed } from '@angular/core/testing';

import { AuditSubjectService } from './audit-subject.service';

describe('AuditSubjectService', () => {
  let service: AuditSubjectService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuditSubjectService
      ]
    });
    service = TestBed.inject(AuditSubjectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
