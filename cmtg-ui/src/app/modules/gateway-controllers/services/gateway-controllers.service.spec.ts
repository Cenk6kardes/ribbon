import { TestBed } from '@angular/core/testing';

import { GatewayControllersService } from './gateway-controllers.service';
import { environment } from 'src/environments/environment';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CmtgRestService } from 'src/app/services/api/cmtg-rest.service';
import { of } from 'rxjs';
import { HttpParams } from '@angular/common/http';

describe('GatewayControllersService', () => {
  let service: GatewayControllersService;
  const cmtgRestService = jasmine.createSpyObj('cmtgRestService',
    ['getDataBody', 'putDataParamBody', 'postDataBody', 'deleteDataBody', 'getStringDataBody', 'put']);

  const messageContent = '200 OK';

  const gwcPath = environment.host + '/DataEngineApi/dataengine/v1.0';

  const apiPath = environment.host + '/GwcemApi/gwcem/v1.0';

  const host = 'https://10.254.166.148:8443';

  const qosCollectorData = {
    qosName: 'test2',
    ipAddress: '12.42.52.3',
    port: '20002'
  };

  const qosCollectorResponse = {
    count: 1,
    list: [
      {
        qosName: 'test1',
        ipAddress: '12.42.52.6',
        port: '20004'
      }
    ]
  };

  const qosCollectionStatusRes = {
    qosReporting: 1,
    currentBaseMetrics: 1,
    rtpBaseRemoteMetrics: 0,
    extraBaseMetrics: 0,
    codecMetrics: 0,
    rtcpxrReporting: 2,
    rtcpxrBlocks: ['0', '0', '0', '0', '0', '0', '0', '0', '0']
  };

  const getUnitStatusRes = {
    unit0ID: '10.254.166.26:161',
    unit0IPAddr: '10.254.166.26',
    unit0Port: 161,
    unit1ID: '10.254.166.27:161',
    unit1IPAddr: '10.254.166.27',
    unit1Port: 161
  };

  const getCarriersDataRetrieve = {
    count: 1,
    crData: [
      {
        gatewayName: 'CO39G9PRI',
        gwHostname: 'CO39G9PRI',
        gwDefaultDomain: 'NOT_SET',
        carrierName: 'TDMs16c2f1/1/1/1',
        nodeNo: 42,
        firstTn: 2073,
        noOfPorts: 24,
        v52InterfaceId: -99,
        v52LinkId: -99,
        v5UALinkId: -99,
        priInterfaceId: 0,
        priIUAInterfaceId: 2010
      }
    ]
  };

  const getDisplayCarriersLinesDataRes = {
    count: 1,
    epData: [
      {
        gwcID: '10.254.166.26:161',
        gatewayName: 'CO39G9PRI',
        gwHostname: 'CO39G9PRI',
        gwDefaultDomain: 'NOT_SET',
        endpointName: 'TDMs16c1f1/1/1/1/1',
        extNodeNumber: 42,
        extTerminalNumber: 2049,
        endpointStatus: 'NOT_SET',
        iid: 0,
        endpointTNType: 4
      }
    ]
  };

  const gwcNodeByNameRes = {
    count: 1,
    nodeList: [
      {
        gwcId: 'GWC-2',
        callServer: {
          name: 'CO39',
          cmMsgIpAddress: ''
        },
        elementManager: {
          ipAddress: '10.254.166.150',
          trapPort: 3162
        },
        serviceConfiguration: {
          gwcNodeNumber: 42,
          activeIpAddress: '10.254.166.24',
          inactiveIpAddress: '10.254.166.25',
          unit0IpAddress: '10.254.166.26',
          unit1IpAddress: '10.254.166.27',
          gwcProfileName: 'LINE_TRUNK_AUD_NA',
          capabilities: [
            {
              capability: { __value: 2 },
              capacity: 4094
            },
            {
              capability: { __value: 3 },
              capacity: 4096
            }
          ],
          bearerNetworkInstance: 'NET 2',
          bearerFabricType: 'IP',
          codecProfileName: 'default',
          execDataList: [
            {
              name: 'DPLEX',
              termtype: 'DPL_TERM'
            },
            {
              name: 'KSETEX',
              termtype: 'KEYSET'
            }
          ],
          defaultGwDomainName: ''
        },
        deviceList: []
      }
    ]
  };

  const getGWCNodesByFilterRes = {
    count: 1,
    nodeList: [
      {
        gwcId: 'GWC-0',
        callServer: {
          name: 'CO39',
          cmMsgIpAddress: ''
        },
        elementManager: {
          ipAddress: '10.254.166.150',
          trapPort: 3162
        },
        serviceConfiguration: {
          gwcNodeNumber: 41,
          activeIpAddress: '10.254.166.16',
          inactiveIpAddress: '10.254.166.17',
          unit0IpAddress: '10.254.166.18',
          unit1IpAddress: '10.254.166.19',
          gwcProfileName: 'LINE_TRUNK_AUD_NA',
          capabilities: [
            {
              capability: {
                __value: 2
              },
              capacity: 4094
            },
            {
              capability: {
                __value: 18
              },
              capacity: 0
            },
            {
              capability: {
                __value: 9
              },
              capacity: 16
            },
            {
              capability: {
                __value: 8
              },
              capacity: 300
            },
            {
              capability: {
                __value: 14
              },
              capacity: 0
            },
            {
              capability: {
                __value: 22
              },
              capacity: 1
            },
            {
              capability: {
                __value: 23
              },
              capacity: 0
            },
            {
              capability: {
                __value: 16
              },
              capacity: 0
            },
            {
              capability: {
                __value: 15
              },
              capacity: 0
            },
            {
              capability: {
                __value: 7
              },
              capacity: 6400
            },
            {
              capability: {
                __value: 3
              },
              capacity: 4096
            },
            {
              capability: {
                __value: 6
              },
              capacity: 20
            },
            {
              capability: {
                __value: 19
              },
              capacity: 0
            },
            {
              capability: {
                __value: 1
              },
              capacity: 6400
            }
          ],
          bearerNetworkInstance: 'NET 2',
          bearerFabricType: 'IP',
          codecProfileName: 'default',
          execDataList: [
            {
              name: 'DPLEX',
              termtype: 'DPL_TERM'
            },
            {
              name: 'DTCEX',
              termtype: 'PRAB'
            },
            {
              name: 'GWCEX',
              termtype: 'ABTRK'
            },
            {
              name: 'POTSEX',
              termtype: 'POTS'
            },
            {
              name: 'KSETEX',
              termtype: 'KEYSET'
            }
          ],
          defaultGwDomainName: ''
        },
        deviceList: []
      }
    ]
  };

  const getGWCNodeByName_v1Res = {
    gwcId: 'GWC-1',
    callServer: {
      name: 'CO39',
      cmMsgIpAddress: ''
    },
    elementManager: {
      ipAddress: '10.254.166.150',
      trapPort: 3162
    },
    serviceConfiguration: {
      gwcNodeNumber: 7,
      activeIpAddress: '10.254.166.20',
      inactiveIpAddress: '10.254.166.21',
      unit0IpAddress: '10.254.166.22',
      unit1IpAddress: '10.254.166.23',
      gwcProfileName: 'SMALL_LINENA_V2',
      capabilities: [
        {
          capability: {
            __value: 1
          },
          capacity: 25600
        },
        {
          capability: {
            __value: 16
          },
          capacity: 0
        },
        {
          capability: {
            __value: 7
          },
          capacity: 25600
        },
        {
          capability: {
            __value: 6
          },
          capacity: 500
        },
        {
          capability: {
            __value: 15
          },
          capacity: 0
        }
      ],
      bearerNetworkInstance: 'NET 2',
      bearerFabricType: 'IP',
      codecProfileName: 'default',
      execDataList: [
        {
          name: 'POTSEX',
          termtype: 'POTS'
        },
        {
          name: 'KSETEX',
          termtype: 'KEYSET'
        }
      ],
      defaultGwDomainName: ''
    },
    deviceList: []
  };

  const getGWEStatisticsResponse = {
    count: 1,
    gwcStatisticsList: [
      {
        gwcStatName: 'Total Reserved Endpoints',
        gwcStatValue: '144'
      }
    ]
  };

  const getGWCMtcControlDataResponseIf = { gwcID: 'GWC-0', autoSwactTimer: -1 };

  const getQueryNtwkCodecProfilesByFilter_v1Res = {
    count: 3,
    ncpList: [
      {
        name: 'default',
        bearerPath: {
          __value: 1
        },
        defaultCodec: {
          __value: 1
        },
        preferredCodec: {
          __value: 4
        },
        alternativeCodec: {
          __value: 2
        },
        packetizationRate: {
          __value: 2
        },
        t38: {
          __value: 0
        },
        rfc2833: {
          __value: 1
        },
        comfortNoise: {
          __value: 1
        },
        bearerTypeDefault: {
          __value: 1
        },
        networkDefault: {
          __value: 1
        }
      }
    ]
  };

  const retriveRes = {
    count: 1,
    gwData: [
      {
        gwcID: '10.254.166.18:161',
        name: 'test834',
        ipAddress: '12.42.52.5',
        mgcsecipAddress: 'null',
        secipAddress: 'null',
        profileName: 'GENBAND_G2_PLG',
        maxTerms: 1023,
        resTerms: 12,
        protocol: 'megaco',
        protVers: '1.0',
        protPort: 2944,
        pepServerName: '<none>',
        middleBoxName: '<none>',
        algName: '<none>',
        nodeName: 'HOST  02 2',
        nodeNumber: 134,
        frame: '2',
        shelf: '2',
        slot: 'NOT_SET',
        locality: 'NOT_SET',
        cac: -1,
        defaultDomainName: 'NOT_SET',
        lgrptype: 'LL_3RDPTY',
        isShared: 'N',
        extStTerm: 0,
        dropdownActions: []
      }
    ]
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        { provide: CmtgRestService, useValue: cmtgRestService }
      ]
    });
    service = TestBed.inject(GatewayControllersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // QoS Collectors Tab
  it('should call getQoSCollectors', () => {
    const gwcId = 'GWC-1';
    const url = `${apiPath}/qos-collector-filter/${gwcId}`;
    cmtgRestService.getDataBody.and.returnValue(of(qosCollectorResponse));

    service.getQosCollectors(gwcId);

    cmtgRestService.getDataBody(url).subscribe((res: any) => {
      expect(res).toBe(qosCollectorResponse);
    });
  });

  it('should call getAvailableAssociationList', () => {
    const gwcId = 'GWC-1';
    const url = `${apiPath}/not-associated/${gwcId}`;
    cmtgRestService.getDataBody.and.returnValue(of(qosCollectorResponse));

    service.getAvailableAssociationList(gwcId);

    cmtgRestService.getDataBody(url).subscribe((res: any) => {
      expect(res).toBe(qosCollectorResponse);
    });
  });

  it('should call associateQoSCollector', () => {
    const gwcId = 'GWC-1';
    const params = new HttpParams();
    const body = {
      qosName: 'test1',
      ipAddress: '',
      port: '20004'
    };
    const url = `${apiPath}/qos-collector-association/${gwcId}`;
    cmtgRestService.putDataParamBody.and.returnValue(of(messageContent));

    service.associateQoSCollector(gwcId, body);

    cmtgRestService.putDataParamBody(url, params, body).subscribe((res: any) => {
      expect(res).toBe(messageContent);
    });
  });

  it('should call getQosCollectionStatus', () => {
    const gwcId = 'GWC-1';
    const url = `${apiPath}/qos-collection-status/${gwcId}`;
    cmtgRestService.getDataBody.and.returnValue(of(qosCollectionStatusRes));

    service.getQosCollectionStatus(gwcId);

    cmtgRestService.getDataBody(url).subscribe((res: any) => {
      expect(res).toBe(qosCollectionStatusRes);
    });
  });

  it('should call postQosCollectionStatus', () => {
    const gwcId = 'GWC-1';
    const url = `${apiPath}/qos-collection-status/${gwcId}`;
    const body = qosCollectionStatusRes;
    cmtgRestService.postDataBody.and.returnValue(of(messageContent));

    service.postQosCollectionStatus(gwcId, body);

    cmtgRestService.postDataBody(url, body).subscribe((res: any) => {
      expect(res).toBe(messageContent);
    });
  });

  it('should call disassociateQoSCollector', () => {
    const gwcId = 'GWC-1';
    const url = `${apiPath}/qos-collector-dissacociation/${gwcId}`;
    const body = qosCollectorData;
    cmtgRestService.postDataBody.and.returnValue(of(messageContent));

    service.disassociateQoSCollector(gwcId, body);

    cmtgRestService.postDataBody(url, body).subscribe((res: any) => {
      expect(res).toBe(messageContent);
    });
  });

  it('should call getEnhRepStatus', () => {
    const gwcId = 'GWC-1';
    const url = `${apiPath}/gwc-version-supported-info/${gwcId}`;
    cmtgRestService.getDataBody.and.returnValue(of(['1','1']));

    service.getEnhRepStatus(gwcId);

    cmtgRestService.getDataBody(url).subscribe((res: any) => {
      expect(res).toEqual(['1','1']);
    });
  });

  it('should call checkRtcpxrSupported', () => {
    const gwcProfile = 'SMALL_LINENA_V2';
    const url = `${apiPath}/is-qos-collection-supported/${gwcProfile}`;
    cmtgRestService.getDataBody.and.returnValue(of(true));

    service.checkRtcpxrSupported(gwcProfile);

    cmtgRestService.getDataBody(url).subscribe((res: any) => {
      expect(res).toEqual(true);
    });
  });

  it('should call getQoSCollector', () => {
    const url = `${apiPath}/qos-collector`;
    cmtgRestService.getDataBody.and.returnValue(of(qosCollectorResponse));

    service.getQoSCollector();

    cmtgRestService.getDataBody(url).subscribe((res: any) => {
      expect(res).toEqual(qosCollectorResponse);
    });
  });

  // Carriers Tab
  it('should call checkV52Supported', () => {
    const url = `${apiPath}/is-v52-supported`;
    cmtgRestService.getDataBody.and.returnValue(of(true));

    service.checkV52Supported();

    cmtgRestService.getDataBody(url).subscribe((res: any) => {
      expect(res).toBe(true);
    });
  });

  it('should call getCarriersDataRetrive', () => {
    const unit0Id = '10.254.166.26:161';
    const maxReturnRows = 25;
    const searchString = 'TDMs16c2f1/';
    const url = `${apiPath}/carrier-data/${unit0Id}/${maxReturnRows}`;
    cmtgRestService.postDataBody.and.returnValue(of(getCarriersDataRetrieve));

    service.getCarriersDataRetrive(unit0Id, searchString, maxReturnRows);

    cmtgRestService.postDataBody(url, `"${searchString}"`).subscribe((res: any) => {
      expect(res).toBe(getCarriersDataRetrieve);
    });
  });

  it('should call getCarriersDataRetriveAll', () => {
    const unit0Id = '10.254.166.26:161';
    const url = `${apiPath}/all-carrier-data/${unit0Id}`;
    cmtgRestService.getDataBody.and.returnValue(of(getCarriersDataRetrieve));

    service.getCarriersDataRetriveAll(unit0Id);

    cmtgRestService.getDataBody(url).subscribe((res: any) => {
      expect(res).toBe(getCarriersDataRetrieve);
    });
  });

  it('should call getDisplayCarriersData', () => {
    const unit0Id = '10.254.166.26:161';
    const gatewayName = 'CO39G9PRI';
    const endpointName = 'TDMs16c1f1/1/1/';
    const url = `${apiPath}/carrier-expansion/${unit0Id}/${gatewayName}`;
    cmtgRestService.postDataBody.and.returnValue(of(getDisplayCarriersLinesDataRes));

    service.getDisplayCarriersData(unit0Id, gatewayName, endpointName);

    cmtgRestService.postDataBody(url, endpointName).subscribe((res: any) => {
      expect(res).toBe(getDisplayCarriersLinesDataRes);
    });
  });

  it('should call getNodeNumber', () => {
    const gwcId = 'GWC-1';
    const url = `${apiPath}/gwc-node-by-name/${gwcId}`;
    cmtgRestService.getDataBody.and.returnValue(of(gwcNodeByNameRes));

    service.getNodeNumber(gwcId);

    cmtgRestService.getDataBody(url).subscribe((res: any) => {
      expect(res).toBe(gwcNodeByNameRes);
    });
  });

  it('should call addCarrier', () => {
    const gwcId = 'GWC-1';
    const srvcType = 1;
    const url = `${apiPath}/carrier/${gwcId}/${srvcType}`;
    const body = {
      gatewayName: 'testcarrier',
      gwHostname: 'NOT_SET',
      gwDefaultDomain: 'NOT_SET',
      carrierName: 'TDMs17c1f1/2/2/2',
      nodeNo: 42,
      firstTn: -99,
      noOfPorts: -99,
      v52InterfaceId: -99,
      v52LinkId: -99,
      v5UALinkId: -99,
      priInterfaceId: -99,
      priIUAInterfaceId: -99
    };
    cmtgRestService.put.and.returnValue(of({
      firstTn: 2097,
      noOfPorts: 24
    }));

    service.addCarrier(body, gwcId, srvcType);

    cmtgRestService.put(url, body).subscribe((res: any) => {
      expect(res).toEqual({
        firstTn: 2097,
        noOfPorts: 24
      });
    });
  });

  it('should call deleteCarrier', () => {
    const carrierPath = environment.host + '/EndptGrpProvApi/endptGrpProv/v1.0';
    const gatewayName = 'testcarrier';
    const url = `${carrierPath}/carrier-sync/${gatewayName}/3000`;
    const body = 'TDMs17c1f1/2/2/2';
    cmtgRestService.postDataBody.and.returnValue(of(messageContent));

    service.deleteCarrier(gatewayName, body);

    cmtgRestService.postDataBody(url, body).subscribe((res: any) => {
      expect(res).toEqual(messageContent);
    });
  });

  // Lines Tab
  it('should call getUnitStatus', () => {
    const gwc = 'GWC-2';
    const url = `${apiPath}/gwc-info/${gwc}`;
    cmtgRestService.getDataBody.and.returnValue(of(getUnitStatusRes));

    service.getUnitStatus(gwc);

    cmtgRestService.getDataBody(url).subscribe((res: any) => {
      expect(res).toBe(getUnitStatusRes);
    });
  });

  it('should call getLinesDataRetrive', () => {
    const gwcID = '10.254.166.26';
    const maxReturnRows = 25;
    const searchString = 'ba/3';
    const url = `${apiPath}/endpoint-data/${gwcID}/${maxReturnRows}`;
    cmtgRestService.postDataBody.and.returnValue(of(getDisplayCarriersLinesDataRes));

    service.getLinesDataRetrive(gwcID, searchString, maxReturnRows);

    cmtgRestService.postDataBody(url, `"${searchString}"`).subscribe((res: any) => {
      expect(res).toBe(getDisplayCarriersLinesDataRes);
    });
  });

  it('should call getLinesDataRetriveAll', () => {
    const ip = '10.254.166.26:161';
    const url = `${apiPath}/all-endpoint-data/${ip}`;
    cmtgRestService.getDataBody.and.returnValue(of(getDisplayCarriersLinesDataRes));

    service.getLinesDataRetriveAll(ip);

    cmtgRestService.getDataBody(url).subscribe((res: any) => {
      expect(res).toBe(getDisplayCarriersLinesDataRes);
    });
  });

  it('should call getGatewaySiteName', () => {
    const ip = '10.254.166.26:161';
    const url = `${apiPath}/all-endpoint-data/${ip}`;
    cmtgRestService.getDataBody.and.returnValue(of(getDisplayCarriersLinesDataRes));

    service.getGatewaySiteName();

    cmtgRestService.getDataBody(url).subscribe((res: any) => {
      expect(res).toBe(getDisplayCarriersLinesDataRes);
    });
  });

  it('should call getGwcList', () => {
    const url = `${gwcPath}/topology-entries/Gateway Controller/500`;
    cmtgRestService.getDataBody.and.returnValue(of({}));

    service.getGwcList();

    cmtgRestService.getDataBody(url).subscribe((res: any) => {
      expect(res).toEqual({});
    });
  });

  it('should call getStatusData_e', () => {
    const unit0ID = '10.254.166.22:161';
    const url = `${apiPath}/status-data/${unit0ID}`;
    cmtgRestService.getDataBody.and.returnValue(of({
      adminState: 'unlocked(1)',
      usageState: '<unknown>',
      operState: 'enabled(1)',
      standbyState: '<unknown>',
      activityState: '<unknown>',
      swactState: '<unknown>',
      isolationState: '<unknown>',
      alarmState: '00 00 00 00',
      availState: '<unknown>',
      faultState: '<unknown>',
      readyState: 'inService(1)',
      haState: 'inactive(2)'
    }));

    service.getStatusData_e(unit0ID);

    cmtgRestService.getDataBody(url).subscribe((res: any) => {
      expect(res).toEqual({
        adminState: 'unlocked(1)',
        usageState: '<unknown>',
        operState: 'enabled(1)',
        standbyState: '<unknown>',
        activityState: '<unknown>',
        swactState: '<unknown>',
        isolationState: '<unknown>',
        alarmState: '00 00 00 00',
        availState: '<unknown>',
        faultState: '<unknown>',
        readyState: 'inService(1)',
        haState: 'inactive(2)'
      });
    });
  });

  it('should call getGWCNodesByFilter_v1', () => {
    const unit0ID = '10.254.166.22:161';
    const url = `${apiPath}/gwc-node-by-name/${unit0ID}`;
    cmtgRestService.getDataBody.and.returnValue(of(getGWCNodesByFilterRes));

    service.getGWCNodesByFilter_v1(unit0ID);

    cmtgRestService.getDataBody(url).subscribe((res: any) => {
      expect(res).toEqual(getGWCNodesByFilterRes);
    });
  });

  it('should call getGWCNodeByName_v1', () => {
    const gwc = 'GWC-2';
    const url = `${apiPath}/gwc-node/${gwc}`;
    cmtgRestService.getDataBody.and.returnValue(of(getGWCNodeByName_v1Res));

    service.getGWCNodeByName_v1(gwc);

    cmtgRestService.getDataBody(url).subscribe((res: any) => {
      expect(res).toEqual(getGWCNodeByName_v1Res);
    });
  });

  it('should call getGWEStatistics', () => {
    const gwc = 'GWC-2';
    const url = `${apiPath}/gwc-statistics/${gwc}`;
    cmtgRestService.getDataBody.and.returnValue(of(getGWEStatisticsResponse));

    service.getGWEStatistics(gwc);

    expect(cmtgRestService.getDataBody).toHaveBeenCalled();
  });

  it('should call getGWCMtcControlData', () => {
    const gwc = 'GWC-2';
    const url = `${apiPath}/gwc-mtc-control-data/${gwc}`;
    cmtgRestService.getDataBody.and.returnValue(of(getGWCMtcControlDataResponseIf));

    service.getGWCMtcControlData(gwc);

    expect(cmtgRestService.getDataBody).toHaveBeenCalled();
  });

  it('should call postGWCMtcControlData', () => {
    const body = {
      gwcID: 'GWC-0',
      autoSwactTimer: 1
    };
    const url = `${apiPath}/gwc-mtc-control-data`;
    cmtgRestService.postDataBody.and.returnValue(of(messageContent));

    service.postGWCMtcControlData(body);

    cmtgRestService.postDataBody(url, body).subscribe((res: any) => {
      expect(res).toBe(messageContent);
    });
  });

  it('should call postConfigureGWCService', () => {
    const gwc = 'GWC-0';
    const codecProfile = 'default';
    const url = `${apiPath}/gwc-service-configuration/${gwc}/${codecProfile}/false`;
    cmtgRestService.postDataBody.and.returnValue(of(messageContent));

    service.postConfigureGWCService(gwc, codecProfile);

    cmtgRestService.postDataBody(url).subscribe((res: any) => {
      expect(res).toBe(messageContent);
    });
  });

  it('should call getQueryNtwkCodecProfilesByFilter_v1', () => {
    const url = `${apiPath}/ntwk-codec-profile`;
    cmtgRestService.getDataBody.and.returnValue(of(getQueryNtwkCodecProfilesByFilter_v1Res));

    service.getQueryNtwkCodecProfilesByFilter_v1();

    cmtgRestService.getDataBody(url).subscribe((res: any) => {
      expect(res).toBe(getQueryNtwkCodecProfilesByFilter_v1Res);
    });
  });

  it('should call getProfiles', () => {
    const gwc = 'GWC-0';
    const url = `${apiPath}/compatible-profiles/${gwc}`;
    cmtgRestService.getDataBody.and.returnValue(of(['LINE_TRUNK_AUD_NA']));

    service.getProfiles(gwc);

    cmtgRestService.getDataBody(url).subscribe((res: any) => {
      expect(res).toEqual(['LINE_TRUNK_AUD_NA']);
    });
  });

  it('should call getFlowthroughStatus', () => {
    const profileName = 'testProfile';
    const url = `${apiPath}/is-flowthrough-gwc/${profileName}`;
    cmtgRestService.getDataBody.and.returnValue(of(true));

    service.getFlowthroughStatus(profileName);

    cmtgRestService.getDataBody(url).subscribe((res: any) => {
      expect(res).toEqual(true);
    });
  });

  it('should call postControllerProfileCallAgentPanelSave', () => {
    const gwcId = 0;
    const clli = 'CO39';
    const url = `${host}/cs2kcfgApi/cs2kcfg/v1.0/gwc-to-cs/${clli}/${gwcId}/60`;
    const body = [
      {
        field_name: 'profile_name',
        value: 'test'
      },
      {
        field_name: 'gwc_name_flowThr',
        value: 'GWC-0'
      },
      {
        field_name: 'active_ip_flowThr',
        value: '1.1.1.1'
      },
      {
        field_name: 'gwc_addressName_flowThr',
        value: 'test'
      }
    ];
    cmtgRestService.postDataBody.and.returnValue(of(messageContent));

    service.postControllerProfileCallAgentPanelSave(gwcId, clli, body);

    cmtgRestService.postDataBody(url, body).subscribe((res: any) => {
      expect(res).toBe(messageContent);
    });
  });

  it('should call getGatewayDataSearchRetrive', () => {
    const gwcID = '10.254.166.26';
    const maxReturnRows = 25;
    const searchString = 'ba/3';
    const url = `${apiPath}/gateway-data-search/${gwcID}/${maxReturnRows}`;
    cmtgRestService.postDataBody.and.returnValue(of(retriveRes));

    service.getGatewayDataSearchRetrive(gwcID, searchString, maxReturnRows);

    cmtgRestService.postDataBody(url, `"${searchString}"`).subscribe((res: any) => {
      expect(res).toEqual(retriveRes);
    });
  });

  it('should call getGatewayDataSearchRetriveAll', () => {
    const gwcID = 'GWC-8';
    const url = `${apiPath}/all-gateway-data/${gwcID}/30000`;
    cmtgRestService.getDataBody.and.returnValue(of(retriveRes));

    service.getGatewayDataSearchRetriveAll(gwcID);

    cmtgRestService.getDataBody(url).subscribe((res: any) => {
      expect(res).toEqual(retriveRes);
    });
  });

  // Gateways Tab
  it('should call putAssociateMediaGateway', () => {
    const timeout = 120;
    const url = environment.host + `/cs2kcfgApi/cs2kcfg/v1.0/gw-association/${timeout}`;
    const requestBody = [{
      tag: 'test',
      value: 'test'
    }];
    cmtgRestService.put.and.returnValue(of({
      rc: {
        __value: 0
      }
    }));

    service.putAssociateMediaGateway(requestBody, timeout);

    cmtgRestService.put(url, requestBody).subscribe((res: any) => {
      expect(res).toEqual({
        rc: {
          __value: 0
        }
      });
    });
  });

  it('should call getIpAddressProtocolPort', () => {
    const profileName = 'test';
    const IpAddress = '1.1.1.1';
    const portNumber = '100';

    const url = `${apiPath}/ip-address-protocol-port/${profileName}/${IpAddress}/${portNumber}`;
    cmtgRestService.getDataBody.and.returnValue(of('200 OK'));

    service.getIpAddressProtocolPort(profileName, IpAddress, portNumber);

    cmtgRestService.getDataBody(url).subscribe((res: any) => {
      expect(res).toBe('200 OK');
    });
  });

  it('should call getEditProfiles', () => {
    const getEditProfilesRes = [
      'TOUCHTONE_NN01_1',
      'TOUCHTONE_NN01_2',
      'TOUCHTONE_NN01_3',
      'TOUCHTONE_NN01_4'
    ];
    const gatewayName = 'test';

    const url = `${apiPath}/compatible-profile-list/${gatewayName}`;
    cmtgRestService.getDataBody.and.returnValue(of(getEditProfilesRes));

    service.getEditProfiles(gatewayName);

    cmtgRestService.getDataBody(url).subscribe((res: any) => {
      expect(res).toBe(getEditProfilesRes);
    });
  });

  it('should call getTgrp', () => {
    const getTgrpResponse = ['TGRP 4'];
    const gwc = 'GWC-0';

    const url = environment.host + `/cs2kcfgApi/cs2kcfg/v1.0/tgrp-cache/${gwc}`;
    cmtgRestService.getDataBody.and.returnValue(of(getTgrpResponse));

    service.getTgrp(gwc);

    cmtgRestService.getDataBody(url).subscribe((res: any) => {
      expect(res).toBe(getTgrpResponse);
    });
  });

  it('should call postGwCapacityPickList', () => {
    const postMethodRes = '200 OK';
    const timeout = Math.ceil((2 * 1023) / 100) * 60;
    const pickListBody = [
      [
        {
          tag: 'clientVers',
          value: '9'
        },
        {
          tag: 'mgUIName',
          value: 'test834'
        },
        {
          tag: 'mgMultiSiteName',
          value: 'test'
        },
        {
          tag: 'reservedTerminations',
          value: 10 * 1023
        }
      ]
    ];
    const url = environment.host + `/cs2kcfgApi/cs2kcfg/v1.0/mg/${timeout}`;
    cmtgRestService.postDataBody.and.returnValue(of(postMethodRes));

    service.postGwCapacityPickList(pickListBody, timeout);

    cmtgRestService.postDataBody(url, pickListBody).subscribe((res: any) => {
      expect(res).toEqual(postMethodRes);
    });
  });

  it('should call getGwCapacityPickList', () => {
    const getGwCapaityPickListRes = {
      count: 2,
      epgData: [
        {
          gatewayName: 'dynamicsvmg',
          gwHostname: 'dynamicsvmg',
          gwDefaultDomain: 'NOT_SET',
          endpointGroupName: 'EA10/000/1',
          nodeNo: 40,
          firstTn: 1,
          noOfPorts: 1023,
          priInterfaceId: -99
        },
        {
          gatewayName: 'dynamicsvmg',
          gwHostname: 'dynamicsvmg',
          gwDefaultDomain: 'NOT_SET',
          endpointGroupName: 'EA10/000/0',
          nodeNo: 167,
          firstTn: 1,
          noOfPorts: 1023,
          priInterfaceId: -99
        }
      ]
    };
    const gwcId = 'GWC-0';
    const searchString = 'test';

    const url = `${apiPath}/endpoint-group-data/${gwcId}/${searchString}/-99`;
    cmtgRestService.getDataBody.and.returnValue(of(getGwCapaityPickListRes));

    service.getGwCapacityPickList(gwcId, searchString);

    cmtgRestService.getDataBody(url).subscribe((res: any) => {
      expect(res).toBe(getGwCapaityPickListRes);
    });
  });

  it('should call getTableCache', () => {
    const mockTableCache = ['item1', 'item2'];
    const url = environment.host + '/cs2kcfgApi/cs2kcfg/v1.0/table-cache';
    cmtgRestService.getDataBody.and.returnValue(of(mockTableCache));

    service.getTableCache();

    cmtgRestService.getDataBody(url).subscribe((res: any) => {
      expect(res).toBe(mockTableCache);
    });
  });

  it('should call postSignalingGwInfo', () => {
    const postMethodRes = '200 OK';
    const gwcId = 'GWC-0';
    const expectedBody = {
      gwName: 'test834',
      sgIPAddr1: '127.0.0.1',
      sgIPAddr2: '0.0.0.0',
      sgPort1: 1234,
      sgPort2: 5678 || '0'
    };

    const url = `${apiPath}/signaling-gw-info/${gwcId}`;
    cmtgRestService.postDataBody.and.returnValue(of(postMethodRes));

    service.postSignalingGwInfo(gwcId, expectedBody);

    cmtgRestService.postDataBody(url, expectedBody).subscribe((res: any) => {
      expect(res).toEqual(postMethodRes);
    });
  });

  it('should call postGrGw', () => {
    const postMethodRes = '200 OK';
    const gatewayName = 'test834';
    const body = '';

    const url = `${apiPath}/vmg-to-gr834-gw/${gatewayName}`;
    cmtgRestService.postDataBody.and.returnValue(of(postMethodRes));

    service.postGrGw(gatewayName, body);

    cmtgRestService.postDataBody(url, body).subscribe((res: any) => {
      expect(res).toEqual(postMethodRes);
    });
  });

  it('should call postLgrpType', () => {
    const postMethodRes = '200 OK';
    const rmLblbody = [
      [
        { tag: 'clientVers', value: '05' },
        { tag: 'mgUIName', value: 'test834' },
        { tag: 'mgLGRPType', value: 'disabled' }
      ]
    ];

    const url = environment.host + '/cs2kcfgApi/cs2kcfg/v1.0/mg/60';
    cmtgRestService.postDataBody.and.returnValue(of(postMethodRes));

    service.postLgrpType(rmLblbody);

    cmtgRestService.postDataBody(url, rmLblbody).subscribe((res: any) => {
      expect(res).toEqual(postMethodRes);
    });
  });

  it('should call saveLgrpType', () => {
    const gwcId = 'GWC-0';
    const gatewayName = 'test834';
    const saveLgrpTypeRes = {
      count: 1,
      gatewayList: [
        {
          gwcId: 'GWC-8',
          gatewayName: 'ilgin5',
          configuration: {
            ipAddress: '32.42.53.5',
            mgcsecipAddress: 'null',
            secipAddress: 'null',
            nodeName: 'HOST 10 2',
            nodeNumber: 160,
            protocol: {
              protocol: {
                __value: 4
              },
              port: 2944,
              version: '1.0'
            },
            profileName: 'GENBAND_G2_PLG',
            pepServerName: '',
            middleBoxName: '',
            itransRootMiddleboxNames: ['NOT_SET'],
            algName: '',
            reservedEndpoints: 100,
            physicalMG: '',
            neId: 0,
            subnetManagerId: '',
            otherInfo: '',
            frame: '10',
            shelf: '2',
            slot: '',
            locality: '',
            cac: -1,
            defaultDomainName: '',
            applicationData: [
              {
                name: 'NOT_SET',
                value: 'NOT_SET'
              }
            ],
            lgrpType: 'LL_3RDPTY',
            isShared: 'N',
            extStTerm: 0
          }
        }
      ]
    };
    const url = `${apiPath}/gateways-by-filter/${gwcId}/${gatewayName}`;
    cmtgRestService.getDataBody.and.returnValue(of(saveLgrpTypeRes));

    service.saveLgrpType(gwcId, gatewayName);

    cmtgRestService.getDataBody(url).subscribe((res: any) => {
      expect(res).toBe(saveLgrpTypeRes);
    });
  });

  it('should call postEdit', () => {
    const postMethodRes = '200 OK';
    const gatewayControllerName = 'GWC-0';
    const gatewayName = 'test834';
    const body = {
      algName: 'testAlg'
    };

    const url = `${apiPath}/gateway/${gatewayControllerName}/${gatewayName}/false`;
    cmtgRestService.postDataBody.and.returnValue(of(postMethodRes));

    service.postEdit(gatewayControllerName, gatewayName, body);

    cmtgRestService.postDataBody(url, body).subscribe((res: any) => {
      expect(res).toEqual(postMethodRes);
    });
  });

  it('should call isLblSupported', () => {
    const isLblSupportedRes = true;
    const body = 'GWC-0';
    const url = `${apiPath}/is-lbl-supported`;
    cmtgRestService.postDataBody.and.returnValue(of(isLblSupportedRes));

    service.isLblSupported(body);

    cmtgRestService.postDataBody(url, body).subscribe((res: any) => {
      expect(res).toEqual(isLblSupportedRes);
    });
  });

  it('should call isGrGwSet', () => {
    const gatewayName = 'GWC-0';
    const grGwSetRes = 'testResponse';
    const url = `${apiPath}/gr834-gw-name/${gatewayName}`;
    cmtgRestService.getStringDataBody.and.returnValue(of(grGwSetRes));

    service.isGrGwSet(gatewayName);

    cmtgRestService.getStringDataBody(url).subscribe((res: any) => {
      expect(res).toEqual(grGwSetRes);
    });
  });

  it('should call isSupportMlt', () => {
    const profileName = 'testName';
    const response = 'true';
    const url = `${apiPath}/is-support-mlt/${profileName}`;
    cmtgRestService.getStringDataBody.and.returnValue(of(response));

    service.isSupportMlt(profileName);

    cmtgRestService.getStringDataBody(url).subscribe((res: any) => {
      expect(res).toEqual('true');
    });
  });

  it('should call getGrGwNamesByType', () => {
    const type = 'G6';
    const getGrGwNamesByTypeRes = ['testGR', 'testGW'];
    const url = `${apiPath}/gr834-gw-names-by-type/${type}`;
    cmtgRestService.getDataBody.and.returnValue(of(getGrGwNamesByTypeRes));

    service.getGrGwNamesByType(type);

    cmtgRestService.getDataBody(url).subscribe((res: any) => {
      expect(res).toBe(getGrGwNamesByTypeRes);
    });
  });

  it('should call getGrGwTypeByProfile', () => {
    const getGrGwTypeByProfileRes = 'G6';
    const profileName = 'testName';

    const url = `${apiPath}/gr834-gw-type-by-profile/${profileName}`;
    cmtgRestService.getStringDataBody.and.returnValue(of(getGrGwTypeByProfileRes));

    service.getGrGwTypeByProfile(profileName);

    cmtgRestService.getStringDataBody(url).subscribe((res: any) => {
      expect(res).toEqual(getGrGwTypeByProfileRes);
    });
  });

  it('should call getLgrpType', () => {
    const gatewayName = 'GENBAND_G9_NA';
    const getLgrpTypeRes = {
      name: 'GENBAND_G6_PLG',
      owner: 'NORTEL',
      maxEndpoints: 4095,
      typeList: ['line'],
      category: {
        __value: 1
      },
      gwcProfileNumber: 84,
      compatibleGWProfiles: ['GENBAND_G6_PLG'],
      supportedProtocols: [
        {
          protocol: {
            __value: 4
          },
          port: -99,
          version: '1.0'
        }
      ],
      endpointType: {
        __value: 8
      },
      inventoryType: 'Third Party',
      inventoryRole: 'Media Gateway',
      bearerFabricRestList: [],
      generateLGRP: 'true',
      resvTermMandatory: 'true',
      changeIPAvailable: 'false',
      dispPhyLocation: 'true',
      multiSiteNamesSupported: 'false',
      fqdnSupported: 'false',
      gwAppDataDefinitionList: [],
      lgrpType: 'LL_3RDPTY_2K,LL_3RDPTY_FLEX',
      lgrpSize: 2048,
      solutionRestList: []
    };
    const url = `${apiPath}/gateway-profile-by-name/${gatewayName}`;

    cmtgRestService.getDataBody.and.returnValue(of(getLgrpTypeRes));

    service.getLgrpType(gatewayName);

    cmtgRestService.getDataBody(url).subscribe((res: any) => {
      expect(res).toBe(getLgrpTypeRes);
    });
  });

  it('should call getGwCapacity_Profiles', () => {
    const profileName = 'mockProfile';
    const mockGwCapacity = {
      multiSiteNamesSupported: 'true'
    };
    const url = `${apiPath}/gateway-profile-by-name/${profileName}`;

    cmtgRestService.getDataBody.and.returnValue(of(mockGwCapacity));

    service.getGwCapacity_Profiles(profileName);

    cmtgRestService.getDataBody(url).subscribe((res: any) => {
      expect(res).toBe(mockGwCapacity);
    });
  });

  it('should call getPepServer', () => {
    const mockResponse = {
      count: 2,
      list: [{ name: 'pepServer1' }, { name: 'pepServer2' }]
    };
    const url = `${apiPath}/pep-server`;

    cmtgRestService.getDataBody.and.returnValue(of(mockResponse));

    service.getPepServer();

    cmtgRestService.getDataBody(url).subscribe((res: any) => {
      expect(res).toBe(mockResponse);
    });
  });

  it('should call getAlg', () => {
    const getAlgRes = {
      count: 3,
      list: [
        {
          name: 'test',
          ipAddress: '12.54.26.8',
          port: 2427,
          protocol: 1
        },
        {
          name: 'test4',
          ipAddress: '3.2.2.3',
          port: 24270,
          protocol: 1
        },
        {
          name: 'test3',
          ipAddress: '1.1.1.13',
          port: 24270,
          protocol: 1
        }
      ]
    };
    const url = `${apiPath}/alg`;

    cmtgRestService.getDataBody.and.returnValue(of(getAlgRes));

    service.getAlg();

    cmtgRestService.getDataBody(url).subscribe((res: any) => {
      expect(res).toBe(getAlgRes);
    });
  });
});
