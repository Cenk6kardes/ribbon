import { TestBed } from '@angular/core/testing';

import { MaintGatewaysCarrierService } from './maint-gateways-carrier.service';
import { ITrunkMtcResourceInterface } from 'src/app/shared/models/trunk-mtc-resource-interface';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { TrunkMtcResourceInterfaceService } from 'src/app/services/api/trunk-mtc-resource-interface.service';
import { of } from 'rxjs';

describe('MaiGatewaysCarrierService', () => {
  let service: MaintGatewaysCarrierService;
  let trunkMtcResourceInterfaceService: TrunkMtcResourceInterfaceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HttpClient,
        HttpHandler,
        TrunkMtcResourceInterfaceService,
        MaintGatewaysCarrierService
      ]
    });
    service = TestBed.inject(MaintGatewaysCarrierService);
    trunkMtcResourceInterfaceService = TestBed.inject(TrunkMtcResourceInterfaceService);

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should be call genericCommandToPerformMaintenanceOrQuerying', () => {
    const command = 'QESByCarrier';
    const dataBody: ITrunkMtcResourceInterface[] = [];
    const sSecurityInfo = 'UserID=1234567';
    service.genericCommandToPerformMaintenanceOrQuerying(command, dataBody, sSecurityInfo);
    spyOn(trunkMtcResourceInterfaceService, 'genericCommandToPerformMaintenanceOrQuerying')
      .and.returnValue(of({
        'QESByCarrier': {
          'Header': {
            'Summary': {
              'State': [
                {
                  'Value': 'UNKNOWN',
                  'Count': 36
                }
              ]
            },
            'GatewayName': 'CO39G9PRI',
            'FilterState': 'ALL',
            'EndpointRange': '0-',
            'NodeNumber': 42
          },
          'Members': {
            'Member': [
              {
                'Error': {
                  'Number': 137,
                  'Message': 'The trunk member is not data filled. Verify data fill in table TRKGRP/TRKSGRP/TRKMEM for C20.',
                  'Severity': 'MAJOR'
                },
                'TerminalNumber': 2054
              }
            ]
          }
        }
      }));
    service.genericCommandToPerformMaintenanceOrQuerying(command, dataBody, sSecurityInfo);
    expect(trunkMtcResourceInterfaceService.genericCommandToPerformMaintenanceOrQuerying)
      .toHaveBeenCalledWith(command, dataBody, sSecurityInfo);
  });
});
