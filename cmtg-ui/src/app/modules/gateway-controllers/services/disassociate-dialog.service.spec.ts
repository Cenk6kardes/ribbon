import { TestBed } from '@angular/core/testing';

import { DisassociateDialogService } from './disassociate-dialog.service';

describe('DisassociateDialogService', () => {
  let service: DisassociateDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DisassociateDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
