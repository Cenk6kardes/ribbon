import { TestBed } from '@angular/core/testing';
import { V52Guard } from './v52.guard';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuditService } from 'src/app/modules/audit/services/audit.service';

describe('V52Guard', () => {
  let guard: V52Guard;
  let auditService: jasmine.SpyObj<AuditService>;

  beforeEach(() => {
    const auditServiceSpy = jasmine.createSpyObj('AuditService', [
      'isV52Supported'
    ]);

    TestBed.configureTestingModule({
      providers: [
        V52Guard,
        { provide: AuditService, useValue: auditServiceSpy }
      ]
    });

    guard = TestBed.inject(V52Guard);
    auditService = TestBed.inject(AuditService) as jasmine.SpyObj<AuditService>;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow access if V52 is supported', (done) => {
    auditService.isV52Supported.and.returnValue(of(true));

    const result = guard.canActivate(
      new ActivatedRouteSnapshot(),
      {} as RouterStateSnapshot
    ) as Observable<boolean>;
    result.subscribe((value: any) => {
      expect(value).toBeTrue();
      done();
    });
  });

  it('should not allow access if V52 is supported', (done) => {
    auditService.isV52Supported.and.returnValue(of(false));

    const result = guard.canActivate(
      new ActivatedRouteSnapshot(),
      {} as RouterStateSnapshot
    ) as Observable<boolean>;
    result.subscribe((value: any) => {
      expect(value).toBeFalse();
      done();
    });
  });
});
