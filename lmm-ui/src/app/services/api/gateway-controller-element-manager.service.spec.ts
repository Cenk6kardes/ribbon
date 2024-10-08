import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { environment } from 'src/environments/environment';

import { GatewayControllerElementManagerService } from './gateway-controller-element-manager.service';
import { LmmRestService } from './lmm-rest.service';
import { IEndpointSearchResult, IGateway } from 'src/app/shared/models/gateway-controller-element-manager';
import { of } from 'rxjs';

describe('GatewayControllerElementManagerService', () => {
  let service: GatewayControllerElementManagerService;
  const lmmRestService = jasmine.createSpyObj('LmmRestService', ['getDataBody']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [{ provide: LmmRestService, useValue: lmmRestService }]
    });
    service = TestBed.inject(GatewayControllerElementManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getGateway', () => {
    const gwcID = 'gwcID';
    const gwName = 'gwName';
    const expectedUrl = `${environment.host}/GwcemApi/gwcem/v1.0/gatewayData/${gwcID}/${gwName}`;
    const fakeResponse = {} as IGateway;
    lmmRestService.getDataBody.and.returnValue(of(fakeResponse));

    service.getGateway(gwcID, gwName).subscribe(response => {
      expect(lmmRestService.getDataBody).toHaveBeenCalledWith(expectedUrl);
      expect(response).toBe(fakeResponse);
    });
  });

  it('should call getGWCList', () => {
    const expectedUrl = `${environment.host}/GwcemApi/gwcem/v1.0/gwc-status-list`;
    lmmRestService.getDataBody.and.returnValue(of(null));

    service.getGWCList().subscribe(() => {
      expect(lmmRestService.getDataBody).toHaveBeenCalledWith(expectedUrl);
    });
  });

  it('should call getEndpointsOrdered', () => {
    const isMG9K = true;
    const epData = 'epData';
    const expectedUrl = `${environment.host}/GwcemApi/gwcem/v1.0/endpoint-by-filter/${epData}/${isMG9K}`;
    lmmRestService.getDataBody.and.returnValue(of(null));

    service.getEndpointsOrdered(epData, isMG9K).subscribe(() => {
      expect(lmmRestService.getDataBody).toHaveBeenCalledWith(expectedUrl);
    });
  });

});
