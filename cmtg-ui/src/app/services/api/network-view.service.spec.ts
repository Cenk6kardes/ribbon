import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { environment } from 'src/environments/environment';

import { NetworkViewService } from './network-view.service';
import { CmtgRestService } from './cmtg-rest.service';
import { Observable, of } from 'rxjs';

describe('NetworkViewService', () => {
  let service: NetworkViewService;
  const cmtgRestService = jasmine.createSpyObj('CmtgRestService', [
    'getDataBody',
    'getStringDataBody'
  ]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: CmtgRestService, useValue: cmtgRestService }]
    });
    service = TestBed.inject(NetworkViewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // it('should call getAllInformationGWElement', () => {
  //   const gateway = 'gateway1';
  //   const expectedUrl = `${environment.host}/NvApi/nv/v1.0/gatewayData/${gateway}`;
  //   const fakeData = {};
  //   cmtgRestService.getDataBody.and.returnValue(of(fakeData));


  //   expect(cmtgRestService.getDataBody).toHaveBeenCalledWith(expectedUrl);
  // });

  // it('should call getGWCData', () => {
  //   const gwcData = 'gwcData';
  //   const expectedUrl = `${environment.host}/NvApi/nv/v1.0/gwcData/${gwcData}`;
  //   const fakeData = {};
  //   cmtgRestService.getDataBody.and.returnValue(of(fakeData));


  //   expect(cmtgRestService.getDataBody).toHaveBeenCalledWith(expectedUrl);
  // });

  it('should call getCMCLLI', () => {
    const expectedUrl = `${environment.host}/NvApi/nv/v1.0/cm-clli`;
    const fakeData = 'fakeData';
    cmtgRestService.getStringDataBody.and.returnValue(of(fakeData));

    const result = service.getCMCLLI();

    expect(cmtgRestService.getStringDataBody).toHaveBeenCalledWith(expectedUrl);
    expect(result).toBeInstanceOf(Observable);
  });

  it('should call getAllGwc', () => {
    const expectedUrl = `${environment.host}/NvApi/nv/v1.0/all-gwc`;
    const fakeData = {};
    cmtgRestService.getDataBody.and.returnValue(of(fakeData));

    const result = service.getAllGwc();

    expect(cmtgRestService.getDataBody).toHaveBeenCalledWith(expectedUrl);
    expect(result).toBeInstanceOf(Observable);
  });

  it('should call getGWCNames', () => {
    const expectedUrl = `${environment.host}/NvApi/nv/v1.0/all-gwc`;
    const fakeData = {};
    cmtgRestService.getDataBody.and.returnValue(of(fakeData));

    const result = service.getGWCNames();

    expect(cmtgRestService.getDataBody).toHaveBeenCalledWith(expectedUrl);
    expect(result).toBeInstanceOf(Observable);
  });

  it('should call getAllSupportedGatewayProfiles', () => {
    const expectedUrl = `${environment.host}/NvApi/nv/v1.0/supported-profile-list`;
    const fakeData = {};
    cmtgRestService.getDataBody.and.returnValue(of(fakeData));

    const result = service.getAllSupportedGatewayProfiles();

    expect(cmtgRestService.getDataBody).toHaveBeenCalledWith(expectedUrl);
    expect(result).toBeInstanceOf(Observable);
  });
});
