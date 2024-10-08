import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { environment } from 'src/environments/environment';

import { NetworkViewService } from './network-view.service';
import { LmmRestService } from './lmm-rest.service';
import { IInformationGWElement } from 'src/app/shared/models/network-view';
import { Observable, of } from 'rxjs';

describe('NetworkViewService', () => {
  let service: NetworkViewService;
  const lmmRestService = jasmine.createSpyObj('LmmRestService', ['getDataBody', 'getStringDataBody']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [{ provide: LmmRestService, useValue: lmmRestService }]
    });
    service = TestBed.inject(NetworkViewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getAllInformationGWElement', () => {
    const gateway = 'gateway1';
    const expectedUrl = `${environment.host}/NvApi/nv/v1.0/gatewayData/${gateway}`;
    const fakeData = { };
    lmmRestService.getDataBody.and.returnValue(of(fakeData));

    const result = service.getAllInformationGWElement(gateway);

    expect(lmmRestService.getDataBody).toHaveBeenCalledWith(expectedUrl);
    expect(result).toBeInstanceOf(Observable);
  });

  it('should call getGWCData', () => {
    const gwcData = 'gwcData';
    const expectedUrl = `${environment.host}/NvApi/nv/v1.0/gwcData/${gwcData}`;
    const fakeData = { };
    lmmRestService.getDataBody.and.returnValue(of(fakeData));

    const result = service.getGWCData(gwcData);

    expect(lmmRestService.getDataBody).toHaveBeenCalledWith(expectedUrl);
    expect(result).toBeInstanceOf(Observable);
  });

  it('should call getCMCLLI', () => {
    const expectedUrl = `${environment.host}/NvApi/nv/v1.0/cm-clli`;
    const fakeData = 'fakeData';
    lmmRestService.getStringDataBody.and.returnValue(of(fakeData));

    const result = service.getCMCLLI();

    expect(lmmRestService.getStringDataBody).toHaveBeenCalledWith(expectedUrl);
    expect(result).toBeInstanceOf(Observable);
  });

});
