import { TestBed } from '@angular/core/testing';

import { AuditService } from './audit.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CmtgRestService } from 'src/app/services/api/cmtg-rest.service';
import { of } from 'rxjs';
import { EDataIntegrity, IAuditConfig, IGranularAuditData, INodeNameNumber } from '../models/audit';

describe('AuditService', () => {
  let service: AuditService;
  const cmtgRestService = jasmine.createSpyObj('cmtgRestService', ['getDataBody', 'postDataBody', 'getStringDataBody',
    'post', 'put', 'putDataParamBody']);
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [{ provide: CmtgRestService, useValue: cmtgRestService }]
    });
    service = TestBed.inject(AuditService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getRegisteredAudit', () => {
    const fakeResponse = [] as Array<string>;
    cmtgRestService.getDataBody.and.returnValue(of(fakeResponse));
    service.getRegisteredAudit().subscribe(response => {
      expect(cmtgRestService.getDataBody).toHaveBeenCalled();
      expect(response).toBe(fakeResponse);
    });
  });

  it('should call getDescription', () => {
    const fakeResponse = [] as Array<string>;
    cmtgRestService.getStringDataBody.and.returnValue(of(fakeResponse));
    service.getDescription(EDataIntegrity.C20_DATA_INTEGRITY_AUDIT).subscribe(response => {
      expect(cmtgRestService.getStringDataBody).toHaveBeenCalled();
      expect(response).toBe(fakeResponse);
    });
  });

  it('should call putAudit', () => {
    const fakeResponse = {} as any;
    const dataBody: IGranularAuditData = {
      data: [],
      type: 0,
      count: 0,
      options: 0
    };
    cmtgRestService.putDataParamBody.and.returnValue(of(fakeResponse));
    service.putAudit('', '', '', dataBody).subscribe(response => {
      expect(cmtgRestService.putDataParamBody).toHaveBeenCalled();
      expect(response).toBe(fakeResponse);
    });
  });

  it('should call postAudit', () => {
    const fakeResponse = {} as any;
    cmtgRestService.postDataBody.and.returnValue(of(fakeResponse));
    service.postAudit('', '').subscribe(response => {
      expect(cmtgRestService.postDataBody).toHaveBeenCalled();
      expect(response).toBe(fakeResponse);
    });
  });

  it('should call getNodeNameNumber', () => {
    const fakeResponse: INodeNameNumber = {
      count: 0,
      list: [
        {
          gwcID: '',
          nodeName: '',
          nodeNN: 1,
          nodeType: ''
        }
      ]
    };
    cmtgRestService.getDataBody.and.returnValue(of(fakeResponse));
    service.getNodeNameNumber().subscribe(response => {
      expect(cmtgRestService.getDataBody).toHaveBeenCalled();
      expect(response).toBe(fakeResponse);
    });
  });

  it('should call getGranularLineTree', () => {
    const fakeResponse = {} as any;
    cmtgRestService.getDataBody.and.returnValue(of(fakeResponse));
    service.getGranularLineTree().subscribe(response => {
      expect(cmtgRestService.getDataBody).toHaveBeenCalled();
      expect(response).toBe(fakeResponse);
    });
  });

  it('should call getRunningAudit', () => {
    const fakeResponse = {} as any;
    cmtgRestService.getDataBody.and.returnValue(of(fakeResponse));
    service.getRunningAudit().subscribe(response => {
      expect(cmtgRestService.getDataBody).toHaveBeenCalled();
      expect(response).toBe(fakeResponse);
    });
  });

  it('should call getPreparationForAudit', () => {
    const fakeResponse = {} as any;
    cmtgRestService.getDataBody.and.returnValue(of(fakeResponse));
    service.getPreparationForAudit('').subscribe(response => {
      expect(cmtgRestService.getDataBody).toHaveBeenCalled();
      expect(response).toBe(fakeResponse);
    });
  });

  it('should call getPreparationForAudit', () => {
    const fakeResponse = {} as any;
    cmtgRestService.getDataBody.and.returnValue(of(fakeResponse));
    service.getPreparationForAudit('').subscribe(response => {
      expect(cmtgRestService.getDataBody).toHaveBeenCalled();
      expect(response).toBe(fakeResponse);
    });
  });

  it('should call getAuditState', () => {
    const fakeResponse = {} as any;
    cmtgRestService.getDataBody.and.returnValue(of(fakeResponse));
    service.getAuditState('').subscribe(response => {
      expect(cmtgRestService.getDataBody).toHaveBeenCalled();
      expect(response).toBe(fakeResponse);
    });
  });

  it('should call postAuditConfiguration', () => {
    const fakeResponse = {} as any;
    cmtgRestService.postDataBody.and.returnValue(of(fakeResponse));
    service.postAuditConfiguration('', {} as IAuditConfig).subscribe(response => {
      expect(cmtgRestService.postDataBody).toHaveBeenCalled();
      expect(response).toBe(fakeResponse);
    });
  });

  it('should call getAuditConfiguration', () => {
    const fakeResponse = {} as any;
    cmtgRestService.getDataBody.and.returnValue(of(fakeResponse));
    service.getAuditConfiguration('').subscribe(response => {
      expect(cmtgRestService.getDataBody).toHaveBeenCalled();
      expect(response).toEqual({ auditType: '', data: fakeResponse });
    });
  });

  it('should call getSessionServerConnected', () => {
    const fakeResponse = {} as any;
    cmtgRestService.getStringDataBody.and.returnValue(of(fakeResponse));
    service.getSessionServerConnected().subscribe(response => {
      expect(cmtgRestService.getStringDataBody).toHaveBeenCalled();
      expect(response).toBe(fakeResponse);
    });
  });

  it('should call getReportList', () => {
    const fakeResponse = {} as any;
    cmtgRestService.getDataBody.and.returnValue(of(fakeResponse));
    service.getReportList('').subscribe(response => {
      expect(cmtgRestService.getDataBody).toHaveBeenCalled();
      expect(response).toBe(fakeResponse);
    });
  });

  it('should call getAuditReport', () => {
    // eslint-disable-next-line max-len
    const fakeResponse: any[] = [{ 'problemID': 0, 'status': { '__value': 0 }, 'problemDescription': 'GWC-4(10.254.166.32)\'s EXECDATA fields are different from those in Call Agent SERVRINV table.', 'possibleActions': [{ 'correctiveAction': 9, 'correctiveTitle': 'Correct ExecData into SESM', 'correctiveDescription': 'Audit will try to correct EXEC Data into SESM database. But if there is no suitable Codec Profile defined in SESM, this action maybe failed. Then manual action will be required. ' }, { 'correctiveAction': 10, 'correctiveTitle': 'Correct ExecData into Call Agent', 'correctiveDescription': 'Audit will try to correct EXEC Data into Call Agent SERVRINV table.' }] }, { 'problemID': 1, 'status': { '__value': 1 }, 'problemDescription': 'There are 20 unused GlobalIDs in SESM database, and the issue has been corrected automatically.', 'possibleActions': [{ 'correctiveAction': 0, 'correctiveTitle': 'No Action Required', 'correctiveDescription': 'The issue has been corrected automatically, totally 20 unused GlobalIDs have been cleared.' }] }];

    cmtgRestService.getDataBody.and.returnValue(of(fakeResponse));
    service.getAuditReport('').subscribe(() => {
      expect(cmtgRestService.getDataBody).toHaveBeenCalled();
    });
  });

  it('should call getlastRunTime', () => {
    const fakeResponse = '';
    cmtgRestService.getStringDataBody.and.returnValue(of(fakeResponse));
    service.getlastRunTime('').subscribe(response => {
      expect(cmtgRestService.getStringDataBody).toHaveBeenCalled();
      expect(response).toBe(fakeResponse);
    });
  });

  it('should call postActionProblem', () => {
    const fakeResponse = {} as any;
    cmtgRestService.postDataBody.and.returnValue(of(fakeResponse));
    service.postActionProblem('', 0, 0, '').subscribe(response => {
      expect(cmtgRestService.postDataBody).toHaveBeenCalled();
      expect(response).toBe(fakeResponse);
    });
  });

  it('should call getLastRunScheduled', () => {
    const fakeResponse = '';
    cmtgRestService.getStringDataBody.and.returnValue(of(fakeResponse));
    service.getLastRunScheduled('').subscribe(response => {
      expect(cmtgRestService.getStringDataBody).toHaveBeenCalled();
      expect(response).toBe(fakeResponse);
    });
  });
});
