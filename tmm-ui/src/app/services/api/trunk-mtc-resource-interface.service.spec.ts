import { TestBed } from '@angular/core/testing';

import { TrunkMtcResourceInterfaceService } from './trunk-mtc-resource-interface.service';
import { ITrunkMtcResourceInterface } from 'src/app/shared/models/trunk-mtc-resource-interface';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TmmRestService } from './tmm-rest.service';
import { environment } from 'src/environments/environment';

describe('TrunkMtcResourceInterfaceService', () => {
  let service: TrunkMtcResourceInterfaceService;
  let httpMock: HttpTestingController;
  let apiUrl: string;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TmmRestService]
    });
    service = TestBed.inject(TrunkMtcResourceInterfaceService);
    httpMock = TestBed.inject(HttpTestingController);
    apiUrl = environment.host + '/TmmApi/tmm/v1.0/maintenance';
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be genericCommandToPerformMaintenanceOrQuerying', () => {
    const command = 'test-command';
    const dataBody: ITrunkMtcResourceInterface[] = [];
    const sSecurityInfo = 'security-info';
    service.genericCommandToPerformMaintenanceOrQuerying(command, dataBody, sSecurityInfo).subscribe();
    const expectedUrl = `${apiUrl}/${command}/${sSecurityInfo}`;
    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('PUT');
  });
});
