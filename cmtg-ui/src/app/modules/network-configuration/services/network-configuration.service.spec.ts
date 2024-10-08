import { TestBed } from '@angular/core/testing';

import { NetworkConfigurationService } from './network-configuration.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CmtgRestService } from 'src/app/services/api/cmtg-rest.service';
import { environment } from 'src/environments/environment';
import { HttpParams } from '@angular/common/http';
import { of } from 'rxjs';
import { IALGs, IEditSelectedALG } from '../components/network/models/algs';

describe('NetworkConfigurationService', () => {
  let service: NetworkConfigurationService;
  const cmtgRestService = jasmine.createSpyObj('cmtgRestService',
    ['getDataBody', 'putDataParamBody', 'postDataBody', 'deleteDataBody', 'getStringDataBody']);

  const messageContent = '200 OK';

  const testName = 'test';

  const apiPath = environment.host + '/GwcemApi/gwcem/v1.0';

  const qosCollectorData = {
    qosName: 'test2',
    ipAddress: '12.42.52.3',
    port: '20002'
  };

  const qosCollectorResponse = {
    'count': 1,
    'list': [
      {
        'qosName': 'test1',
        'ipAddress': '12.42.52.6',
        'port': '20004'
      }
    ]
  };

  const getAlgsResponse = {
    'count': 1,
    'list': [
      {
        'name': 'test',
        'ipAddress': '12.54.26.8',
        'port': 2427,
        'protocol': 1
      }
    ]
  };

  const dataALG: IALGs = {
    'name': 'test',
    'ipAddress': '12.54.26.8',
    'port': 2427,
    'protocol': 1
  };

  const editAlgDataBody: IEditSelectedALG = {
    'ipAddress': '12.54.26.8',
    'port': 2427,
    'protocol': 1
  };

  const getGRGWsDataResponse = {
    'count': 1,
    'list': [
      {
        'g6Name': 'testGW',
        'type': 'G6',
        'ipAddress': '65.85.47.5',
        'port': 65529,
        'userName': 'testuser',
        'passWd': 'testing'
      }
    ]
  };

  const gwTypesResponse = [ 'G6', 'G2' ];

  const gRGWdata = {
    'g6Name': 'testGW',
    'type': 'G6',
    'ipAddress': '65.85.47.5',
    'port': 65529,
    'userName': 'testuser',
    'passWd': 'testing'
  };

  const getPepServersResponse = {
    count: 1,
    list: [
      {
        name: 'test1',
        ipAddress: '12.12.12.1',
        boxType: 5,
        maxConnections: 10,
        protocol: 9,
        protVersion: '0.4'
      }
    ]
  };

  const pepServerData = {
    name: 'test1',
    ipAddress: '12.12.12.1',
    boxType: 5,
    maxConnections: 10,
    protocol: 9,
    protVersion: '0.4'
  };

  const editPepServerDataBody = {
    ipAddress: '12.12.12.1',
    maxConnections: 10,
    protVersion: '0.4'
  };

  const ntwkCodecProfileData = {
    'name': 'tst',
    'bearerPath': 1,
    'defaultCodec': 2,
    'preferredCodec': 1,
    'alternativeCodec': 4,
    'packetizationRate': 2,
    't38': 1,
    'rfc2833': 1,
    'comfortNoise': 0,
    'bearerTypeDefault': 0,
    'networkDefault': 0
  };

  const getNtwkCodecProfileResponse = {
    'count': 3,
    'ncpList': [
      {
        'name': 'default',
        'bearerPath': {
          '__value': 1
        },
        'defaultCodec': {
          '__value': 1
        },
        'preferredCodec': {
          '__value': 4
        },
        'alternativeCodec': {
          '__value': 2
        },
        'packetizationRate': {
          '__value': 2
        },
        't38': {
          '__value': 0
        },
        'rfc2833': {
          '__value': 1
        },
        'comfortNoise': {
          '__value': 1
        },
        'bearerTypeDefault': {
          '__value': 1
        },
        'networkDefault': {
          '__value': 1
        }
      }
    ]
  };

  const dqosData = {
    'dsField': 184,
    't1Value': 315,
    't2Value': 0,
    'keepAliveTimer': 30,
    't7Value': 200,
    't8Value': 0
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
    service = TestBed.inject(NetworkConfigurationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // QoS Collectors
  it('should call getQoSCollectors', () => {
    const url = `${apiPath}/qos-collector`;
    cmtgRestService.getDataBody.and.returnValue(of(qosCollectorResponse));

    service.getQoSCollectors();

    cmtgRestService.getDataBody(url).subscribe((res: any) => {
      expect(res).toBe(qosCollectorResponse);
    });
  });

  it('should call addQoSCollector', () => {
    const url = `${apiPath}/qos-collector`;
    const params = new HttpParams();
    cmtgRestService.putDataParamBody.and.returnValue(of(messageContent));

    service.addQoSCollector(qosCollectorData);

    cmtgRestService.putDataParamBody(url, params, qosCollectorData).subscribe((res: any) => {
      expect(res).toBe(messageContent);
    });
  });

  it('should call deleteQosCollector', () => {
    const force = true;
    const url = `${apiPath}/qos-collector-del/${force}`;
    cmtgRestService.postDataBody.and.returnValue(of(messageContent));

    service.deleteQosCollector(force, qosCollectorData);

    cmtgRestService.postDataBody(url, qosCollectorData).subscribe((res: any) => {
      expect(res).toBe(messageContent);
    });
  });

  // GR-834 GWs

  it('should call getGRGWs', () => {
    const url = `${apiPath}/g6mlt-info`;
    cmtgRestService.getDataBody.and.returnValue(of(getGRGWsDataResponse));

    service.getGRGWs();

    cmtgRestService.getDataBody(url).subscribe((res: any) => {
      expect(res).toBe(getGRGWsDataResponse);
    });
  });

  it('should call getGWType', () => {
    const url = `${apiPath}/gr834-gw-types`;
    cmtgRestService.getDataBody.and.returnValue(of(gwTypesResponse));

    service.getGWType();

    cmtgRestService.getDataBody(url).subscribe((res: any) => {
      expect(res).toBe(gwTypesResponse);
    });
  });

  it('should call addGRGW', () => {
    const url = `${apiPath}/g6mlt-info`;
    const params = new HttpParams();
    cmtgRestService.putDataParamBody.and.returnValue(of(gwTypesResponse));

    service.addGRGW(gRGWdata);

    cmtgRestService.putDataParamBody(url, params, gRGWdata).subscribe((res: any) => {
      expect(res).toBe(gwTypesResponse);
    });
  });

  it('should call isGRGWUsed', () => {
    const name = testName;
    const url = `${apiPath}/is-gr834-gw-used/${name}`;
    cmtgRestService.getDataBody.and.returnValue(of(messageContent));

    service.isGRGWUsed(name);

    cmtgRestService.getDataBody(url).subscribe((res: any) => {
      expect(res).toBe(messageContent);
    });
  });

  it('should call deleteGRGW', () => {
    const force = false;
    const url = `${apiPath}/g6mlt-info-del/${force}`;
    cmtgRestService.postDataBody.and.returnValue(of(messageContent));

    service.deleteGRGW(force, gRGWdata);

    cmtgRestService.postDataBody(url, gRGWdata).subscribe((res: any) => {
      expect(res).toBe(messageContent);
    });
  });

  it('should call editGRGW', () => {
    const url = `${apiPath}/g6mlt-info`;
    cmtgRestService.postDataBody.and.returnValue(of(messageContent));

    service.editGRGW(gRGWdata);

    cmtgRestService.postDataBody(url, gRGWdata).subscribe((res: any) => {
      expect(res).toBe(messageContent);
    });
  });

  // Pep Servers

  it('should call getPepServers', () => {
    const url = `${apiPath}/pep-server`;
    cmtgRestService.getDataBody.and.returnValue(of(getPepServersResponse));

    service.getPepServers();

    cmtgRestService.getDataBody(url).subscribe((res: any) => {
      expect(res).toBe(getPepServersResponse);
    });
  });

  it('should call addPepServer', () => {
    const url = `${apiPath}/pep-server`;
    const params = new HttpParams();
    cmtgRestService.putDataParamBody.and.returnValue(of(messageContent));

    service.addPepServer(pepServerData);

    cmtgRestService.putDataParamBody(url, params, pepServerData).subscribe((res: any) => {
      expect(res).toBe(messageContent);
    });
  });

  it('should call deletePepServer', () => {
    const pepName = testName;
    const url = `${apiPath}/pep-server/${pepName}`;
    cmtgRestService.deleteDataBody.and.returnValue(of(messageContent));

    service.deletePepServer(pepName);

    cmtgRestService.deleteDataBody(url).subscribe((res: any) => {
      expect(res).toBe(messageContent);
    });
  });

  it('should call editPepServer', () => {
    const pepName = testName;
    const url = `${apiPath}/pep-server/${pepName}`;
    cmtgRestService.postDataBody.and.returnValue(of(messageContent));

    service.editPepServer(editPepServerDataBody, pepName);

    cmtgRestService.postDataBody(url).subscribe((res: any) => {
      expect(res).toBe(messageContent);
    });
  });

  // General Network Settings

  it('should call getCallAgentIP', () => {
    const url = `${apiPath}/list-of-csips`;
    cmtgRestService.getDataBody.and.returnValue(of([ '10.254.166.44', '10.254.166.45' ]));

    service.getCallAgentIP();

    cmtgRestService.getDataBody(url).subscribe((res: any) => {
      expect(res).toEqual([ '10.254.166.44', '10.254.166.45' ]);
    });
  });

  it('should call getGWCDomainName', () => {
    const url = `${apiPath}/gwc-domain-name`;
    cmtgRestService.getStringDataBody.and.returnValue(of(testName));

    service.getGWCDomainName();

    cmtgRestService.getStringDataBody(url).subscribe((res: any) => {
      expect(res).toBe('test');
    });
  });

  it('should call updateGWCDomainName', () => {
    const url = `${apiPath}/gwc-domain-name`;
    const params = new HttpParams();
    cmtgRestService.putDataParamBody.and.returnValue(of(testName));

    service.updateGWCDomainName(testName);

    cmtgRestService.putDataParamBody(url, params, testName).subscribe((res: any) => {
      expect(res).toBe('test');
    });
  });

  // Codec Profile //

  // Network Codec Profile

  it('should call getNtwkCodecProfile', () => {
    const url = `${apiPath}/ntwk-codec-profile`;
    cmtgRestService.getDataBody.and.returnValue(of(getNtwkCodecProfileResponse));

    service.getNtwkCodecProfile();

    cmtgRestService.getDataBody(url).subscribe((res: any) => {
      expect(res).toBe(getNtwkCodecProfileResponse);
    });
  });

  it('should call addNwkCodecProfile', () => {
    const url = `${apiPath}/ntwk-codec-profile`;
    const params = new HttpParams();
    cmtgRestService.putDataParamBody.and.returnValue(of(messageContent));

    service.addNwkCodecProfile(ntwkCodecProfileData);

    cmtgRestService.putDataParamBody(url, params, ntwkCodecProfileData).subscribe((res: any) => {
      expect(res).toBe(messageContent);
    });
  });

  it('should call deleteNwkCodecProfile', () => {
    const profileName = testName;
    const url = `${apiPath}/ntwk-codec-profile/${profileName}`;
    cmtgRestService.deleteDataBody.and.returnValue(of(messageContent));

    service.deleteNwkCodecProfile(profileName);

    cmtgRestService.deleteDataBody(url).subscribe((res: any) => {
      expect(res).toBe(messageContent);
    });
  });

  it('should call editNwkCodecProfile', () => {
    const url = `${apiPath}/ntwk-codec-profile`;
    cmtgRestService.postDataBody.and.returnValue(of(messageContent));

    service.editNwkCodecProfile(ntwkCodecProfileData);

    cmtgRestService.postDataBody(url, ntwkCodecProfileData).subscribe((res: any) => {
      expect(res).toBe(messageContent);
    });
  });

  // DQoS Configuration

  it('should call getDQoSConf', () => {
    const url = `${apiPath}/dqos-system-policy`;
    cmtgRestService.getDataBody.and.returnValue(of(dqosData));

    service.getDQoSConf();

    cmtgRestService.getDataBody(url).subscribe((res: any) => {
      expect(res).toBe(dqosData);
    });
  });

  it('should call saveDQoSConf', () => {
    const url = `${apiPath}/dqos-system-policy`;
    const params = new HttpParams();
    cmtgRestService.putDataParamBody.and.returnValue(of(messageContent));

    service.saveDQoSConf(dqosData);

    cmtgRestService.putDataParamBody(url, params, dqosData).subscribe((res: any) => {
      expect(res).toBe(messageContent);
    });
  });
});
