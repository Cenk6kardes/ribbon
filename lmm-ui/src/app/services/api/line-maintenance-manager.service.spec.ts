import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { LineMaintenanceManagerService } from './line-maintenance-manager.service';
import { LmmRestService } from './lmm-rest.service';
// import { environment } from 'src/environments/environment';
import { of } from 'rxjs';
import {
  IGatewayEndpointInfo,
  ILineMtcResponseInfo,
  ILinePostResponseInfo,
  ILineRequest,
  ILineValidateResponseInfo } from 'src/app/shared/models/line-maintenance-manager';
import { HttpResponse } from '@angular/common/http';

describe('LineMaintenanceManagerService', () => {
  let service: LineMaintenanceManagerService;
  const lmmRestService = jasmine.createSpyObj('LmmRestService', ['getDataBody', 'postDataBody', 'getStringDataBody', 'post']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [{ provide: LmmRestService, useValue: lmmRestService }]
    });
    service = TestBed.inject(LineMaintenanceManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getLineInformationByDNAndCLLI', () => {
    const dn = '123456';
    const clli = 'CLLI123';
    const expectedUrl = `${service.apiPath}/line-validation/${dn}/${clli}`;
    const fakeResponse = {} as ILineValidateResponseInfo;
    lmmRestService.getDataBody.and.returnValue(of(fakeResponse));

    service.getLineInformationByDNAndCLLI(dn, clli).subscribe(response => {
      expect(lmmRestService.getDataBody).toHaveBeenCalledWith(expectedUrl);
      expect(response).toBe(fakeResponse);
    });
  });

  it('should call getLinePostInformation', () => {
    const line = {
      cm_clli: 'CO39',
      cm_tid: '2015631214',
      endpoint_name: 'aaln/2',
      gw_address: '0.0.0.0',
      gw_name: 'testgwc2'
    };
    const expectedUrl = `${service.apiPath}/line-information`;
    const fakeResponse = {} as ILinePostResponseInfo;
    lmmRestService.postDataBody.and.returnValue(of(fakeResponse));

    service.getLinePostInformation(line).subscribe(response => {
      expect(lmmRestService.postDataBody).toHaveBeenCalledWith(expectedUrl, line);
      expect(response).toBe(fakeResponse);
    });
  });

  it('should call getEndpointStateInformation', () => {
    const gwc_address = 'gwc123';
    const cm_tid = 'tid123';
    const cm_tidSplit = cm_tid.split('.');
    const nodeNumber = cm_tidSplit[0];
    const terminalNumber = cm_tidSplit[2];
    const expectedUrl = `${service.apiPath}/endpoint-state/${gwc_address}/${nodeNumber}/${terminalNumber}`;
    const fakeResponse = {} as IGatewayEndpointInfo;
    lmmRestService.getDataBody.and.returnValue(of(fakeResponse));

    service.getEndpointStateInformation(gwc_address, cm_tid).subscribe(response => {
      expect(lmmRestService.getDataBody).toHaveBeenCalledWith(expectedUrl);
      expect(response).toBe(fakeResponse);
    });
  });

  it('should call getCLLI', () => {
    const cBMgIP = '123.456.789.0';
    const expectedUrl = `${service.apiPath}/cm-clli/${cBMgIP}`;
    const fakeResponse = 'CLLI123';
    lmmRestService.getStringDataBody.and.returnValue(of(fakeResponse));

    service.getCLLI(cBMgIP).subscribe(response => {
      expect(lmmRestService.getStringDataBody).toHaveBeenCalledWith(expectedUrl);
      expect(response).toBe(fakeResponse);
    });
  });

  it('should call getLineInformationByTIDAndCLLI', () => {
    const tid = 'tid';
    const clli = 'CLLI123';
    const expectedUrl = `${service.apiPath}/line-validation-tid/${tid}/${clli}`;
    const fakeResponse = {} as ILineValidateResponseInfo;
    lmmRestService.getDataBody.and.returnValue(of(fakeResponse));

    service.getLineInformationByTIDAndCLLI(tid, clli).subscribe(response => {
      expect(lmmRestService.getDataBody).toHaveBeenCalledWith(expectedUrl);
      expect(response).toBe(fakeResponse);
    });
  });

  it('should cancel deload', () => {
    const line: ILineRequest = {
      cm_clli: 'CLLI1',
      cm_tid: 'TID1',
      gw_name: 'GW1',
      gw_address: '123.456.789.0',
      endpoint_name: 'Endpoint1'
    };
    const expectedUrl = `${service.apiPath}/deload-cancellation`;
    lmmRestService.post.and.returnValue(of(new HttpResponse()));
    service.cancelDeload(line).subscribe();
    expect(lmmRestService.post).toHaveBeenCalledWith(expectedUrl, line);
  });

});
