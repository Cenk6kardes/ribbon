import { TestBed } from '@angular/core/testing';

import { AuditResolver } from './audit.resolver';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CTypeDataIntegrity } from '../models/audit';

describe('AuditResolver', () => {
  let resolver: AuditResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(AuditResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });

  it('should return data for C20 Data Integrity Audit when the URL contains "c20-data-integrity"', () => {
    const routeSnapshot = new ActivatedRouteSnapshot();
    const stateSnapshot = {} as RouterStateSnapshot;
    stateSnapshot.url = '/' + CTypeDataIntegrity.c20DataIntegrityAudit.stateUrl;
    const result = resolver.resolve(routeSnapshot, stateSnapshot);
    result.subscribe((data) => {
      expect(data.auditDataIntegrity.type).toEqual(CTypeDataIntegrity.c20DataIntegrityAudit.type);
    });
  });

  it('should return data for Line Data Integrity Audit when the URL contains "line-data-integrity"', () => {
    const routeSnapshot = new ActivatedRouteSnapshot();
    const stateSnapshot = {} as RouterStateSnapshot;
    stateSnapshot.url = '/' + CTypeDataIntegrity.lineDataIntegrityAudit.stateUrl;
    const result = resolver.resolve(routeSnapshot, stateSnapshot);
    result.subscribe((data) => {
      expect(data.auditDataIntegrity.type).toEqual(CTypeDataIntegrity.lineDataIntegrityAudit.type);
    });
  });

  it('should return data for Trunk Data Integrity Audit when the URL contains "trunk-data-integrity"', () => {
    const routeSnapshot = new ActivatedRouteSnapshot();
    const stateSnapshot = {} as RouterStateSnapshot;
    stateSnapshot.url = '/' + CTypeDataIntegrity.trunkDataIntegrityAudit.stateUrl;
    const result = resolver.resolve(routeSnapshot, stateSnapshot);
    result.subscribe((data) => {
      expect(data.auditDataIntegrity.type).toEqual(CTypeDataIntegrity.trunkDataIntegrityAudit.type);
    });
  });

  it('should return data undefined', () => {
    const routeSnapshot = new ActivatedRouteSnapshot();
    const stateSnapshot = {} as RouterStateSnapshot;
    stateSnapshot.url = '/';
    const result = resolver.resolve(routeSnapshot, stateSnapshot);
    result.subscribe((data) => {
      expect(data.auditDataIntegrity).toEqual(undefined);
    });
  });
});
