import { TestBed } from '@angular/core/testing';

import { AuditUtilitiesService } from './audit-utilities.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { C20AuditComponentOptions, EDataIntegrity } from '../models/audit';

describe('AuditUtilitiesService', () => {
  let service: AuditUtilitiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuditUtilitiesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call isScheduledAuditAvailable', () => {
    // eslint-disable-next-line max-len
    const param = { 'enabled': true, 'timeToRun': '16:22', 'once': true, 'daily': false, 'weekly': false, 'monthly': false, 'sunday': false, 'monday': false, 'tuesday': false, 'wednesday': false, 'thursday': false, 'friday': false, 'saturday': false, 'day': '12-12-2023', 'interval': 1, 'granularAuditData': { 'data': [{ 'data': 'MCS', 'type': 5 }], 'type': 3, 'count': 1, 'options': 0 } };
    const check = service.isScheduledAuditAvailable(param);
    expect(check).toBeTrue();
  });

  it('should call getGranularAuditData case C20 Data Integrity Audit', () => {
    const auditForm = new FormGroup({
      auditName: new FormControl(),
      auditDescription: new FormControl(),
      auditComponent: new FormControl([] as any, Validators.required)
    });
    auditForm.get('auditName')?.setValue(EDataIntegrity.C20_DATA_INTEGRITY_AUDIT);
    auditForm.get('auditComponent')?.setValue([C20AuditComponentOptions[0].value]);
    const dataBody = service.getGranularAuditData(auditForm);
    expect(dataBody.data[0].data === C20AuditComponentOptions[0].value).toBeTruthy();
    auditForm.get('auditComponent')?.setValue([C20AuditComponentOptions[1].value]);
    const dataBody1 = service.getGranularAuditData(auditForm);
    expect(dataBody1.data[0].data === C20AuditComponentOptions[1].value).toBeTruthy();
  });

  it('should call getGranularAuditData case Line Data Integrity Audit', () => {
    const auditForm = new FormGroup({
      auditName: new FormControl(),
      auditDescription: new FormControl(),
      auditConfiguration: new FormGroup({
        treePick: new FormControl(),
        options: new FormControl()
      })
    });
    auditForm.get('auditName')?.setValue(EDataIntegrity.LINE_DATA_INTEGRITY_AUDIT);
    // eslint-disable-next-line max-len
    auditForm.get('auditConfiguration.treePick')?.setValue([{ 'key': '0-0-0-0', 'label': 'GWC-0', 'data': { 'type': 0 }, 'partialSelected': false, 'parent': null }, { 'key': '0-0-0-1', 'label': 'GWC-1', 'data': { 'type': 0 }, 'partialSelected': false, 'parent': null }]);
    auditForm.get('auditConfiguration.options')?.setValue(['Fragmentation']);
    const dataBody = service.getGranularAuditData(auditForm);
    expect(dataBody.data.length > 0).toBeTruthy();
  });

  it('should call getGranularAuditData case Trunk Data Integrity Audit', () => {
    const auditForm = new FormGroup({
      auditName: new FormControl(),
      auditDescription: new FormControl(),
      auditTrunk: new FormControl()
    });
    auditForm.get('auditName')?.setValue(EDataIntegrity.TRUNK_DATA_INTEGRITY_AUDIT);
    const dataBody = service.getGranularAuditData(auditForm);
    expect(dataBody.data.length === 0).toBeTruthy();
  });
});
