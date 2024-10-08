import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { HomeService } from './home.service';
import { LineMaintenanceManagerService } from 'src/app/services/api/line-maintenance-manager.service';
import { GatewayControllerElementManagerService } from 'src/app/services/api/gateway-controller-element-manager.service';
import { NetworkViewService } from 'src/app/services/api/network-view.service';

describe('HomeService', () => {
  let service: HomeService;
  const lineMaintenanceManagerService = jasmine.createSpyObj('lineMaintenanceManagerService', [
    'getLineInformationByDNAndCLLI',
    'getLinePostInformation',
    'getEndpointStateInformation',
    'getLineInformationByTIDAndCLLI',
    'cancelDeload',
    'getMaintenance',
    'getQdn',
    'getQsip'
  ]);

  const gatewayControllerElementManagerService = jasmine.createSpyObj('gatewayControllerElementManagerService', [
    'getGateway',
    'getLMMLineGatewayNames',
    'getEndpointsOrdered'
  ]);

  const networkViewService = jasmine.createSpyObj('networkViewService', [
    'getAllInformationGWElement',
    'getGWCData',
    'getCMCLLI'
  ]);


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        { provide: LineMaintenanceManagerService, useValue: lineMaintenanceManagerService },
        { provide: GatewayControllerElementManagerService, useValue: gatewayControllerElementManagerService },
        { provide: NetworkViewService, useValue: networkViewService }
      ]
    });
    service = TestBed.inject(HomeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getLineInformationByDNAndCLLI', () => {
    service.getLineInformationByDNAndCLLI('1038831001', 'CO2');
    expect(lineMaintenanceManagerService.getLineInformationByDNAndCLLI).toHaveBeenCalled();
  });

  it('should call getLinePostInformation', () => {
    const line = {
      cm_clli: 'CO39',
      cm_tid: '2015631214',
      endpoint_name: 'aaln/2',
      gw_address: '0.0.0.0',
      gw_name: 'testgwc2'
    };
    service.getLinePostInformation(line);
    expect(lineMaintenanceManagerService.getLinePostInformation).toHaveBeenCalled();
  });

  it('should call getGateway', () => {
    service.getGateway('', '');
    expect(gatewayControllerElementManagerService.getGateway).toHaveBeenCalled();
  });

  it('should call getAllInformationGWElement', () => {
    service.getAllInformationGWElement('');
    expect(networkViewService.getAllInformationGWElement).toHaveBeenCalled();
  });

  it('should call getEndpointStateInformation', () => {
    service.getEndpointStateInformation('', '');
    expect(lineMaintenanceManagerService.getEndpointStateInformation).toHaveBeenCalled();
  });

  it('should call getLMMLineGatewayNames', () => {
    service.getLMMLineGatewayNames('');
    expect(gatewayControllerElementManagerService.getLMMLineGatewayNames).toHaveBeenCalled();
  });

  it('should call getGWCData', () => {
    service.getGWCData('');
    expect(networkViewService.getGWCData).toHaveBeenCalled();
  });

  it('should call getLineInformationByTIDAndCLLI', () => {
    service.getLineInformationByTIDAndCLLI('', '');
    expect(lineMaintenanceManagerService.getLineInformationByTIDAndCLLI).toHaveBeenCalled();
  });

  it('should call getEndpointsOrdered', () => {
    service.getEndpointsOrdered('', true);
    expect(gatewayControllerElementManagerService.getEndpointsOrdered).toHaveBeenCalled();
  });

  it('should call postCancelDeload', () => {
    service.postCancelDeload({
      cm_clli: '',
      cm_tid: '',
      gw_name: '',
      gw_address: '',
      endpoint_name: ''
    });
    expect(lineMaintenanceManagerService.cancelDeload).toHaveBeenCalled();
  });

  it('should call getCMCLLI', () => {
    service.getCMCLLI();
    expect(networkViewService.getCMCLLI).toHaveBeenCalled();
  });

  it('should call getMaintenance', () => {
    service.getMaintenance('', {
      cm_clli: '',
      cm_tid: '',
      gw_name: '',
      gw_address: '',
      endpoint_name: ''
    });
    expect(lineMaintenanceManagerService.getMaintenance).toHaveBeenCalled();
  });

  it('should call getQdn', () => {
    service.getQdn('');
    expect(lineMaintenanceManagerService.getQdn).toHaveBeenCalled();
  });

  it('should call getQsip', () => {
    service.getQsip('');
    expect(lineMaintenanceManagerService.getQsip).toHaveBeenCalled();
  });
});
