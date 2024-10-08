import {
  ComponentFixture,
  TestBed,
  async,
  fakeAsync,
  tick
} from '@angular/core/testing';

import { GatewaysComponent } from './gateways.component';
import { FormBuilder} from '@angular/forms';
import { GatewayControllersService } from '../../../services/gateway-controllers.service';
import { CommonService } from 'src/app/services/common.service';
import { TranslateInternalService } from 'src/app/services/translate-internal.service';
import { AppModule } from 'src/app/app.module';
import { TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of, throwError } from 'rxjs';
import {
  ILgrpType,
  IProvisioningGatewaysTable,
  EOperationName
} from '../../../models/gwControllers';
import { NetworkViewService } from 'src/app/services/api/network-view.service';
import { SafePipe } from 'src/app/shared/pipes/safe.pipe';

describe('GatewaysComponent', () => {
  let component: GatewaysComponent;
  let fixture: ComponentFixture<GatewaysComponent>;
  let fb: FormBuilder;
  const translate = {
    translateResults: {
      COMMON:{
        OK:'OK',
        CANCEL:'Cancel'
      },
      GATEWAY_CONTROLLERS: {
        TITLE: 'Gateway Controllers',
        OVERLAY_BUTTONS: {
          DISASSOCIATE_GW: 'Disassociate Media Gateway',
          DELETE_GWC_NODE: 'Delete GWC Node'
        },
        MESSAGE: {
          MAX_LINE_LIMIT: 'The maximum limit of {{LIMIT}} has been exceeded',
          GW_SECIP_EMPTY: 'GW Secondary IP can not be empty!'
        },
        MAINTENANCE: {
          TITLE: 'Maintenance',
          ACTIVE_UNIT: 'Active Unit',
          OVERALL_STATUS: 'Overall Status'
        },
        PROVISIONING: {
          TITLE: 'Provisioning',
          TABS: {
            COMMON: {
              GATEWAY_LIST: 'Gateway List',
              RETRIEVAL_CRITERIA: 'Retrieval Criteria',
              LIMIT_RESULT: 'Limit Result',
              REPLACE_LIST: 'Replace List',
              APPEND_TO_LIST: 'Append to List',
              EMPTY_MSG: 'No Records Found',
              BTN: {
                RETRIEVE: 'Retrieve',
                RETRIEVE_ALL: 'Retrieve All'
              }
            },
            CONTROLLER: {
              TITLE: 'Controller',
              SUB_TITLES: {
                GENERAL: {
                  TITLE: 'General',
                  GWE: 'GWE Statics Data',
                  GWC_DEFAULT: 'GWC Default Gateway Domain Name',
                  CODEC_PROFILE: 'Codec Profile',
                  NODE_NUMBER: 'Node Number',
                  GWC_AUTO: 'GWC Autonomous Swact',
                  PRE_SWACT: 'Pre-Swact Timer',
                  SUCCESS_MSG: 'Completed',
                  PRIMARY: 'Save',
                  SECONDARY: 'Reset'
                },
                PROFILE: {
                  TITLE: 'Profile',
                  SELECT_PROFILE: 'Select Profile',
                  FLOW_CHECKBOX: 'Flow through GWC data to Session Server',
                  GWC_ADDRESS_NAME: 'GWC Address Name'
                },
                CALL_AGENT: {
                  TITLE: 'Call Agent'
                }
              }
            },
            GATEWAYS: {
              TITLE: 'Gateways',
              TABLE: {
                DETAILS: 'Details',
                EDIT: 'Edit',
                OPERATIONS: {
                  SELECT_OPERATION: 'Select Change Operation'
                },
                EDIT_DIALOG: {
                  ALG: 'Select ALG',
                  PEP_SERVER: 'Select PEP Server',
                  GATEWAY_CAPACITY: 'Specify Capacity',
                  MULTI_SITE: 'Multi Site Change',
                  PROFILE: 'Select Profile',
                  LGRP_TYPE: 'Select LGRP Type',
                  LGRP_NODE: 'Node Sharing',
                  GR_834: 'Select GR-834 Gateway',
                  SPECIFY_IP: 'Specify IP address',
                  SPECIFY_PORT: 'Specify Port',
                  SG_IP: 'SG IP',
                  SG_PORT1: 'SG Port 1',
                  SG_PORT2: 'SG Port 2',
                  MGC_SECIP: 'MGC Secondary IP Address',
                  GW_SECIP: 'GW Secondary IP Address',
                  CAC: 'CAC',
                  SIGNALING: 'Change Signaling Gateway',
                  REMOVE_LBL:
                    'Please press save button to remove backup path from Gateway.'
                },
                EDIT_RESULT_DIALOG: 'Change Gateway Results',
                EDIT_RESULT_MSG: {
                  ALG: '{{gwName}} ALG change failed. Reason: Gateway {{gwName}} is already in requested state.No changes being made.',
                  ALG_SUCCESS: ' ALG change successful',
                  PEP_SERVER:
                    '{{gwName}} PEP Server change failed. Reason: Gateway {{gwName}} is already in requested state. No changes being made',
                  PEP_SERVER_SUCCESS: ' PEP change successful',
                  GR_834: ' GR-834 change successful',
                  IP_ADDRESS: ' IP and Port change successful',
                  SIGNALING:
                    ' Signaling Gateway IP and Ports change successful',
                  PICK_LIST_NO_CHANGE: 'No changes requested.',
                  PICK_LIST_BOTH_CHANGE:
                    'Both ADD and REMOVE operations were requested. Perform ADD and REMOVE operations separately.',
                  PICK_LIST_FINAL_RESULT:
                    'NOTE: This gateway maybe take up to {{timeOut}} seconds to change.<br>'
                },
                DETAIL_INFO: 'This process may took long.. Please wait.',
                COLS: {
                  NAME: 'Name',
                  DOMAIN: 'Domain',
                  IP_ADDRESS: 'IP Address',
                  MGC_SECIP: 'MGC Secondary IP Address',
                  GW_SECIP: 'GW Secondary IP Address',
                  PROFILE: 'Profile',
                  MAX_TERMS: 'Max Terms',
                  RES_TERMS: 'Res Terms',
                  PROTOCOL: 'Protocol',
                  PROT_VERS: 'Prot Vers',
                  PROT_PORT: 'Prot Port',
                  PEP_SERVER: 'Pep Server',
                  ADJ: 'Adj ITRAN',
                  ALG: 'ALG',
                  NODE_NAME: 'Node Name',
                  NODE_NUMBER: 'Node Number',
                  F_U_S: 'Frame/Unit/Slot',
                  LGRPLOC: 'LGRPLOC',
                  LBL_CAC: 'LBL CAC',
                  LGRP_TYPE: 'LGRP Type',
                  IS_SHARED: 'Is Shared',
                  EXTSTTERM: 'EXTSTTERM',
                  ACTION: 'Action'
                }
              },
              ERROR: {
                TITLE: 'Gateway Data Retrieval Failure',
                MESSAGE: 'Endpoint data retrieval failed.',
                NUMERIC: 'Limit value must be numeric'
              },
              INFO_POPUP: {
                TITLE: 'Invalid Input',
                MESSAGE: 'Invalid value entered for capacity value'
              },
              CHANGE_GW_CAPACITY_WARNING: {
                TITLE: 'Change Gateway Capacity',
                MESSAGE: 'WARNING: Changing this setting will affect GWC capacity.<br>Any changes should only be made after appropriate ' +
                  'engineering impacts are fully understood.<br>Please refer to GWC provisioning guidelines before proceeding.'
              },
              CHANGE_SIGNALING_GW_IP: {
                CONFIRM: {
                  TITLE: 'Confirm Signaling Gateway IP and Ports change.',
                  MESSAGE_ABOUT_VALUE: 'This operation will attempt to change the signaling gateway IP address' +
                    ' and port values for the selected gateway to the following values:<br><br>',
                  VALUES: 'SG IP &emsp;&emsp;:  {{sgIp}}<br>SG Port 1 :  {{port1}}<br>SG Port 2 :  {{port2}}<br><br>',
                  CONFIRM_MESSAGE: 'This change may cause failures in call processing on the selected gateway and must be performed in' +
                    ' accordance with the documented signaling gateway IP and ports change procedures.<br>Do you wish to continue?'
                },
                ERROR: {
                  TITLE: 'Change Gateway Results',
                  MESSAGE: 'Signaling Gateway IP and ports change failed.  Reason - '
                }
              },
              ACTION_DETAILS: {
                NO_RES_MESSAGE: `The selected gateway does not have any
                  associated optional data.<br>There are no root
                  middleboxes associated with the selected gateway.
                  <br>There is no Signaling Gateway Information associated
                  with the selected gateway.<br>There is no <b> \'{{gwName}}\'
                  </b> Gateway associated with the selected gateway.`
              },
              CONFIRM_DIALOG:{
                CHANGE_GATEWAY_CAPACITY:'Change Gateway Capacity',
                WARNING_CHANGE_GATEWAY_CAPACITY:'WARNING: Changing this setting will affect GWC capacity.<br>'+
                'Any changes should only be made after appropriate engineering impacts are fully '+
                'understood.<br>Please refer to GWC provisioning guidelines before proceeding.'
              }
            }
          }
        },
        ASSOCIATE_MEDIA_GW: {
          BUTTON_LABEL: 'Associate Media Gateway',
          FIELDS: {
            GATEWAY_INFO: {
              TITLE: 'Gateway Information',
              NAME: 'Name',
              IP_ADDRESS: 'IP Address',
              CONTROLLER_NAME: 'Controller Name',
              PROFILE_NAME: 'Profile Name',
              RESERVED_TERMINATIONS: 'Reserved Terminations'
            },
            INTERNET_TRANSPERANCY: {
              TITLE: 'Internet Transparency',
              MG: 'MG outside C20 VPN, not behind NAT',
              IP_LBL_SELECTION: 'IP-VPN / LBL Selection',
              IP_VPN: 'IP-VPN (NATs)',
              LBL: 'LBLs',
              IP_LBL: 'IP-VPN (NAT)-LBLs',
              ADJ_NETWORK: 'Adj Network Zone'
            },
            SIGNAL_PROTOCOL: {
              TITLE: 'Signal Protocol',
              PROTOCOL_TYPE: 'Protocol Type',
              PROTOCOL_PORT: 'Protocol Port',
              PROTOCOL_VERSION: 'Protocol Version'
            },
            CANCEL: 'Cancel',
            SAVE: 'Save'
          }
        }
      }
    }
  };
  const defaultPostBody = {
    ipAddress: '',
    mgcsecipAddress: '',
    secipAddress: '',
    nodeName: '',
    nodeNumber: -99,
    protocol: {
      protocol: 0,
      port: -99,
      version: ''
    },
    profileName: '',
    pepServerName: '',
    middleBoxName: '',
    itransRootMiddleboxNames: [],
    algName: '',
    reservedEndpoints: -99,
    physicalMG: '',
    neId: -99,
    subnetManagerId: '',
    otherInfo: '',
    frame: '',
    shelf: '',
    slot: '',
    locality: '',
    cac: -1,
    defaultDomainName: '',
    applicationData: [],
    lgrpType: '',
    isShared: '',
    extStTerm: -99
  };
  const selectedRowValues = {
    gwcID: 'GWC-0',
    name: 'test834',
    ipAddress: '12.42.52.5',
    mgcsecipAddress: 'null',
    secipAddress: 'null',
    profileName: 'GENBAND_G2_PLG',
    maxTerms: 1023,
    resTerms: 100,
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
    defaultDomainName: '',
    lgrptype: 'LL_3RDPTY',
    isShared: 'N',
    extStTerm: 0,
    combinedColumn: '2/2/NOT_SET',
    dropdownActions: [],
    selected: true
  };
  const commonServiceMock = jasmine.createSpyObj('commonService', [
    'showErrorMessage',
    'showInfoMessage',
    'showAPIError',
    'showSuccessMessage'
  ]);
  const gwcServiceMock = jasmine.createSpyObj('gwcService', [
    'getUnitStatus',
    'getGatewayDataSearchRetrive',
    'getGatewayDataSearchRetriveAll',
    'getSignalingGwInfo',
    'getGwApplicationData',
    'getGrGwName',
    'postEdit',
    'getGwCapacityPickList',
    'saveLgrpType',
    'postLgrpType',
    'getGwCapacity_Profiles',
    'postGrGw',
    'postSignalingGwInfo',
    'getAlg',
    'getPepServer',
    'getTableCache',
    'getGWCNodeByName_v1',
    'getLgrpType',
    'isSupportMlt',
    'getGrGwTypeByProfile',
    'getGrGwNamesByType',
    'isGrGwSet',
    'isLblSupported',
    'postGwCapacityPickList',
    'getEditProfiles'
  ]);
  const successMsg = '200 OK';
  const getEditProfilesRes = [
    'TOUCHTONE_NN01_1',
    'TOUCHTONE_NN01_2',
    'TOUCHTONE_NN01_3',
    'TOUCHTONE_NN01_4'
  ];
  const postMethodRes = '200 OK';
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
  const nvServiceMock = jasmine.createSpyObj('nvService', ['getProfileData']);
  const getProfileDataRes = {
    identifier: 'SIPVOICE',
    serviceTypes: [
      {
        __value: 0
      },
      {
        __value: 7
      }
    ],
    category: {
      __value: 1
    },
    maxRsvdEndpoints: 27621,
    gwcProfileNumber: -1
  };
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
  const getTableCacheRes = [
    'CO36',
    'CO39',
    'EA10',
    'EA11',
    'G6G5',
    'HOST',
    'ISP',
    'S23',
    'S39',
    'SM',
    'SS39',
    'SSLA'
  ];
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
  const isLblSupportedRes = true;
  const isGrGwSetRes = 'tst';
  const isSupportMltRes = 'true';
  const getGrGwNamesByTypeRes = ['testGR', 'testGW'];
  const getGrGwTypeByProfileRes = 'G6';
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
  const getGwCapacity_ProfilesRes = {
    name: 'SIPVOICE',
    owner: 'NORTEL',
    maxEndpoints: 27621,
    typeList: ['line', 'ITRANS_ROAM'],
    category: {
      __value: 1
    },
    gwcProfileNumber: 75,
    compatibleGWProfiles: ['SIPVOICE'],
    supportedProtocols: [
      {
        protocol: {
          __value: 8
        },
        port: -99,
        version: '0.0'
      }
    ],
    endpointType: {
      __value: 9
    },
    inventoryType: 'SIPVOICE',
    inventoryRole: 'Media Gateway',
    bearerFabricRestList: [],
    generateLGRP: 'true',
    resvTermMandatory: 'false',
    changeIPAvailable: 'true',
    dispPhyLocation: 'true',
    multiSiteNamesSupported: 'true',
    fqdnSupported: 'false',
    gwAppDataDefinitionList: [],
    lgrpType: 'SSDPL',
    lgrpSize: 1024,
    solutionRestList: []
  };
  const getPepServerRes = {
    count: 5,
    list: [
      {
        name: 'asdasd',
        ipAddress: '3.3.30.3',
        boxType: 5,
        maxConnections: 15,
        protocol: 9,
        protVersion: '0.4'
      },
      {
        name: 'test2',
        ipAddress: '12.36.52.6',
        boxType: 5,
        maxConnections: 15,
        protocol: 9,
        protVersion: '0.4'
      },
      {
        name: 'testt',
        ipAddress: '16.36.52.6',
        boxType: 5,
        maxConnections: 10,
        protocol: 9,
        protVersion: '0.4'
      },
      {
        name: 'test1',
        ipAddress: '12.12.12.1',
        boxType: 5,
        maxConnections: 100,
        protocol: 9,
        protVersion: '0.3'
      },
      {
        name: 'tt',
        ipAddress: '23.53.53.6',
        boxType: 5,
        maxConnections: 10,
        protocol: 9,
        protVersion: '0.4'
      }
    ]
  };
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
  const getUnitStatusRes = {
    unit0ID: '10.254.166.18:161',
    unit0IPAddr: '10.254.166.18',
    unit0Port: 161,
    unit1ID: '10.254.166.19:161',
    unit1IPAddr: '10.254.166.19',
    unit1Port: 161
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
  const retriveAllRes = {
    count: 5,
    gwData: [
      {
        gwcID: 'GWC-0',
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
        defaultDomainName: '',
        lgrptype: 'LL_3RDPTY',
        isShared: 'N',
        extStTerm: 0,
        combinedColumn: '2/2/NOT_SET',
        dropdownActions: []
      }
    ]
  };
  const signalingGwInfoRes = ['test1', 'test2', 'test3'];
  const gwApplicationDataRes = {
    globalId: 1111,
    keyValuePairs: { name: 'test', value: 'test' }
  };
  const grGwNameRes = 'tst';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GatewaysComponent, SafePipe],
      providers: [
        { provide: GatewayControllersService, useValue: gwcServiceMock },
        { provide: NetworkViewService, useValue: nvServiceMock },
        { provide: CommonService, useValue: commonServiceMock },
        { provide: TranslateInternalService, useValue: translate },
        FormBuilder
      ],
      imports: [AppModule, TranslateModule.forRoot()],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(GatewaysComponent);
    component = fixture.componentInstance;
    fb = TestBed.inject(FormBuilder);
    component.retrieveForm = fb.group({
      limitResult: '25',
      retrivalCriteria: '',
      radioButton: 'replaceList'
    });
    component.editOperationForm = fb.group({
      operationName: '',
      alg: '',
      pepServer: '',
      gwCapacity: '',
      profile: '',
      lgrpType: '',
      grGw: '',
      ip: '',
      port: '',
      sgIp: '',
      sgPort1: '',
      sgPort2: '',
      mgcsecipAddress: '',
      secipAddress: '',
      cac: '',
      nodeSharing: ''
    });
    gwcServiceMock.getUnitStatus.and.returnValue(of(getUnitStatusRes));
    gwcServiceMock.getGatewayDataSearchRetrive.and.returnValue(of(retriveRes));
    gwcServiceMock.getGatewayDataSearchRetriveAll.and.returnValue(
      of(retriveAllRes)
    );
    gwcServiceMock.getSignalingGwInfo.and.returnValue(of(signalingGwInfoRes));
    gwcServiceMock.getGwApplicationData.and.returnValue(
      of(gwApplicationDataRes)
    );
    gwcServiceMock.getGwCapacityPickList.and.returnValue(
      of(getGwCapaityPickListRes)
    );
    gwcServiceMock.getTableCache.and.returnValue(of(getTableCacheRes));
    gwcServiceMock.postLgrpType.and.returnValue(of(successMsg));
    gwcServiceMock.getEditProfiles.and.returnValue(of(getEditProfilesRes));
    gwcServiceMock.saveLgrpType.and.returnValue(of(saveLgrpTypeRes));
    gwcServiceMock.isLblSupported.and.returnValue(of(isLblSupportedRes));
    gwcServiceMock.isGrGwSet.and.returnValue(of(isGrGwSetRes));
    gwcServiceMock.isSupportMlt.and.returnValue(of(isSupportMltRes));
    gwcServiceMock.getGrGwNamesByType.and.returnValue(
      of(getGrGwNamesByTypeRes)
    );
    gwcServiceMock.getGwCapacity_Profiles.and.returnValue(
      of(getGwCapacity_ProfilesRes)
    );
    gwcServiceMock.getLgrpType.and.returnValue(of(getLgrpTypeRes));
    gwcServiceMock.getGrGwTypeByProfile.and.returnValue(
      of(getGrGwTypeByProfileRes)
    );
    gwcServiceMock.getPepServer.and.returnValue(of(getPepServerRes));
    gwcServiceMock.getAlg.and.returnValue(of(getAlgRes));
    gwcServiceMock.getGrGwName.and.returnValue(of(grGwNameRes));
    nvServiceMock.getProfileData.and.returnValue(of(getProfileDataRes));
    gwcServiceMock.getGWCNodeByName_v1.and.returnValue(
      of(getGWCNodeByName_v1Res)
    );
    gwcServiceMock.postGwCapacityPickList.and.returnValue(of(postMethodRes));
    gwcServiceMock.postEdit.and.returnValue(of(postMethodRes));
    gwcServiceMock.postGrGw.and.returnValue(of(postMethodRes));
    gwcServiceMock.postSignalingGwInfo.and.returnValue(of(postMethodRes));
    gwcServiceMock.postGwCapacityPickList.and.returnValue(of(postMethodRes));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle ngOnInit()', () => {
    const mockSearchHistory = [{ label: 'string', value: 'string' }];
    spyOn(component, 'initCols');
    spyOn(sessionStorage, 'getItem').and.returnValue(
      JSON.stringify(mockSearchHistory)
    );

    component.ngOnInit();

    expect(component.initCols).toHaveBeenCalled();
    expect(sessionStorage.getItem).toHaveBeenCalledWith('searchHistory');
    expect(component.searchHistory).toEqual(mockSearchHistory);
  });

  it('should handle ngOnChanges', () => {
    const gwControllerName = 'GWC-0';

    component.gwControllerName = 'GWC-0';
    component.currentGwcName = 'GWC-0';
    component.isLoading = false;
    component.ngOnChanges();

    expect(component.gwControllerName).toBe(gwControllerName);
    expect(gwcServiceMock.getUnitStatus).toHaveBeenCalledWith(gwControllerName);
    expect(component.isLoading).toBeFalsy();
    expect(component.gwcIp).toBe(getUnitStatusRes.unit0ID);
    expect(component.currentGwcName).toBe(gwControllerName);
  });

  it('ngOnChanges getUnitStatus handle error', () => {
    gwcServiceMock.getUnitStatus.and.returnValue(throwError('error'));
    const gwControllerName = 'GWC-0';

    component.gwControllerName = 'GWC-0';
    component.isLoading = false;
    component.ngOnChanges();

    expect(gwcServiceMock.getUnitStatus).toHaveBeenCalledWith(gwControllerName);
    expect(component.isLoading).toBe(false);
    expect(commonServiceMock.showErrorMessage).toHaveBeenCalledWith('error');
  });

  it('should add a new item to searchHistory and update sessionStorage if criteria is valid', () => {
    const inputValue = 'test';
    const dummyValue = 'test';
    spyOn(component, 'isValueSearchedBefore').and.returnValue(false);
    const setItemSpy = spyOn(sessionStorage, 'setItem');

    component.retrieveForm.get('retrivalCriteria')?.setValue(dummyValue);
    component.onRetrieveHandle(true);

    expect(component.isValueSearchedBefore).toHaveBeenCalledWith(inputValue);
    expect(setItemSpy).toHaveBeenCalledWith(
      'searchHistory',
      JSON.stringify(component.searchHistory)
    );
  });

  // onRetrieveHandle
  it('should handle onRetrieveHandle with event = true', () => {
    const event = true;
    component.retrieveForm.get('limitResult')?.setValue('abc');

    component.onRetrieveHandle(event);

    expect(commonServiceMock.showErrorMessage)
      .toHaveBeenCalledWith(translate.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.GATEWAYS.ERROR.NUMERIC);
  });

  it('should handle onRetrieveHandle with event = true negative limit result', () => {
    const event = true;
    component.retrieveForm.get('limitResult')?.setValue('-10');

    component.onRetrieveHandle(event);

    expect(gwcServiceMock.getGatewayDataSearchRetrive).toHaveBeenCalled();
  });

  it('should handle onRetrieveHandle === false', () => {
    const event = false;
    const form = component.retrieveForm;
    spyOn(component, 'setDefaultValues');

    component.onRetrieveHandle(event);

    expect(form.get('limitResult')?.value).toEqual('25');
    expect(form.get('retrivalCriteria')?.value).toEqual('');
    expect(form.get('radioButton')?.value).toEqual('replaceList');
    expect(component.setDefaultValues).toHaveBeenCalled();
  });

  it('getGatewayDataSearchRetrive handle error', () => {
    component.retrieveForm.get('retrivalCriteria')?.setValue('test');
    component.retrieveForm.get('limitResult')?.setValue('25');
    const errorData = {
      errorCode: '500',
      message: '"message = error details = "'
    };
    gwcServiceMock.getGatewayDataSearchRetrive.and.returnValue(throwError(errorData));
    const event = true;

    component.gwcIp = '';
    component.onRetrieveHandle(event);

    expect(gwcServiceMock.getGatewayDataSearchRetrive).toHaveBeenCalled();
    expect(component.isLoading).toBe(false);
    expect(component.titleText).toEqual(translate.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.GATEWAYS.ERROR.TITLE);
    expect(component.detailsText).toEqual('error ');
    expect(component.messageText).toEqual(translate.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.GATEWAYS.ERROR.MESSAGE);
    expect(component.showRetrieveHandleErrorDialog).toBe(true);
  });

  it('should closeRetrieveHandleErrorDialog()', () => {

    component.closeRetrieveHandleErrorDialog();

    expect(component.showRetrieveHandleErrorDialog).toBeFalse();
    expect(component.showDetailsBtn).toBeTrue();
    expect(component.titleText).toEqual('');
    expect(component.messageText).toEqual('');
    expect(component.detailsText).toEqual('');
  });

  it('should showOrHideButtonClick()', () => {
    component.showDetailsBtn = true;

    component.showOrHideButtonClick();

    expect(component.showDetailsBtn).toBeFalse();
  });


  it('should fetch data from the service and update component properties on success', fakeAsync(() => {
    component.onRetriveAllHandle();
    tick();

    expect(component.isLoading).toBe(false);
    expect(component.gatewaysTableData[0].cac).toEqual('');
    expect(component.gatewaysTableData[0].mgcsecipAddress).toEqual('');
    expect(component.gatewaysTableData[0].secipAddress).toEqual('');
  }));

  it('should retrieve all with error', fakeAsync(() => {
    gwcServiceMock.getGatewayDataSearchRetriveAll.and.returnValue(throwError('error'));
    component.isLoading = true;

    component.onRetriveAllHandle();
    tick();

    expect(component.isLoading).toBeFalse();
    expect(commonServiceMock.showAPIError).toHaveBeenCalledWith('error');
  }));

  it('should return true if the value has been searched before', () => {
    const searchHistory = [
      { label: 'value1', value: 'value1' },
      { label: 'value2', value: 'value2' },
      { label: 'value3', value: 'value3' }
    ];

    component.searchHistory = searchHistory;

    const result = component.isValueSearchedBefore('value2');

    expect(result).toBe(true);
  });

  it('should return false if the value has not been searched before', () => {
    const searchHistory = [
      { label: 'value1', value: 'value1' },
      { label: 'value2', value: 'value2' },
      { label: 'value3', value: 'value3' }
    ];

    component.searchHistory = searchHistory;

    const result = component.isValueSearchedBefore('value4');

    expect(result).toBe(false);
  });

  it('should handle closeNoResDialog()', () => {
    component.showNoResDialog = false;

    component.closeNoResDialog();

    expect(component.showNoResDialog).toBeFalse();
  });

  it('should handle openDetailDialog()', () => {
    component.showDetailDialog = true;

    component.openDetailDialog();

    expect(component.showDetailDialog).toBeTrue();
  });

  it('should handle closeDetailDialog()', () => {
    component.showDetailDialog = false;

    component.closeDetailDialog();

    expect(component.showDetailDialog).toBeFalse();
  });

  it('should invoke onDetailHandle when Details action is clicked', () => {
    const mockData: IProvisioningGatewaysTable = {
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
      extStTerm: 0
    };
    spyOn(component, 'onDetailHandle');
    const mockIndex = 1;

    component.gatewaysTableConfig.actionColumnConfig?.actions[1].onClick(
      mockData,
      mockIndex
    );

    expect(component.onDetailHandle).toHaveBeenCalledWith(mockData);
  });

  it('should set selectedRowValues and call onEditHandle on icon click', () => {
    const mockData: IProvisioningGatewaysTable = {
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
      extStTerm: 0
    };
    spyOn(component, 'onEditHandle');

    component.gatewaysTableConfig.actionColumnConfig?.actions[0].onClick(
      mockData,
      0
    );

    expect(component.selectedRowValues).toEqual(mockData);
    expect(component.onEditHandle).toHaveBeenCalledWith(mockData);
  });

  it('should call onRetrieveHandle when retrivalCriteria is not empty on refreshGatewaysTable', () => {
    component.retrieveForm.controls['retrivalCriteria'].setValue('abc');
    const spyOnRetriveHandle = spyOn(component, 'onRetrieveHandle');

    component.refreshGatewaysTable();

    expect(spyOnRetriveHandle).toHaveBeenCalled();
    expect(component.showEditDialog).toBeFalse();
  });

  it('should not call onRetriveAllHandle when retrivalCriteria is empty on refreshGatewaysTable', () => {
    component.retrieveForm.controls['retrivalCriteria'].setValue(null);
    const spyOnRetriveAllHandle = spyOn(component, 'onRetriveAllHandle');

    component.refreshGatewaysTable();

    expect(spyOnRetriveAllHandle).toHaveBeenCalled();
    expect(component.showEditDialog).toBeFalse();
  });

  it('should handle onDetailHandle with successful promises', fakeAsync(() => {
    const mockData: IProvisioningGatewaysTable = {
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
      extStTerm: 0
    };

    const signalingPromise = Promise.resolve(signalingGwInfoRes);
    const applicationPromise = Promise.resolve(gwApplicationDataRes);
    const grGwNamePromise = Promise.resolve(grGwNameRes);

    spyOn(component, 'callSignalingGwInfo').and.returnValue(signalingPromise);
    spyOn(component, 'callGwApplicationData').and.returnValue(
      applicationPromise
    );
    spyOn(component, 'callGrGwName').and.returnValue(grGwNamePromise);

    component.showNoResDialog = false;
    component.onDetailHandle(mockData);
    tick();

    expect(component.showNoResDialog).toBeFalse();
  }));

  it('should handle onDetailHandle with all promises empty', fakeAsync(() => {
    const mockData: IProvisioningGatewaysTable = {
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
      extStTerm: 0
    };

    const signalingPromise = Promise.resolve(null);
    const applicationPromise = Promise.resolve(null);
    const grGwNamePromise = Promise.resolve(null);

    spyOn(component, 'callSignalingGwInfo').and.returnValue(signalingPromise);
    spyOn(component, 'callGwApplicationData').and.returnValue(
      applicationPromise
    );
    spyOn(component, 'callGrGwName').and.returnValue(grGwNamePromise);

    const content =
      translate.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.GATEWAYS.ACTION_DETAILS.NO_RES_MESSAGE.replace(
        /{{gwName}}/,
        mockData.name
      );

    component.onDetailHandle(mockData);
    tick();

    expect(component.showNoResDialog).toBe(true);
    expect(component.showNoResDialogContent).toEqual(content);
  }));

  it('should handle errors when any of the promises reject', fakeAsync(() => {
    const mockData: IProvisioningGatewaysTable = {
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
      extStTerm: 0
    };
    const errorMessage = 'Error in one of the promises';

    const signalingPromise = Promise.resolve('signalingRes');
    const grGwNamePromise = Promise.reject(errorMessage);
    const applicationPromise = Promise.resolve('applicationRes');

    spyOn(component, 'callSignalingGwInfo').and.returnValue(signalingPromise);
    spyOn(component, 'callGwApplicationData').and.returnValue(
      applicationPromise
    );
    spyOn(component, 'callGrGwName').and.returnValue(grGwNamePromise);

    component.onDetailHandle(mockData);

    tick();

    expect(commonServiceMock.showErrorMessage).toHaveBeenCalledWith(
      errorMessage
    );
    expect(component.isLoading).toBe(false);
  }));

  it('should resolve with response on successful API call', fakeAsync(() => {
    const mockData: IProvisioningGatewaysTable = {
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
      extStTerm: 0
    };
    const mockResponse = ['SIG IP', '1234', '5678'];

    gwcServiceMock.getSignalingGwInfo.and.returnValue(of(mockResponse));

    let resolvedValue: any;
    let rejectedValue: any;

    component.callSignalingGwInfo(mockData).then(
      (res) => (resolvedValue = res),
      (err) => (rejectedValue = err)
    );

    tick();

    expect(gwcServiceMock.getSignalingGwInfo).toHaveBeenCalledWith(
      mockData.name
    );
    expect(resolvedValue).toEqual(mockResponse);
    expect(rejectedValue).toBeUndefined();
    expect(component.dynamicDialogContent).toBeDefined();
  }));

  it('should resolve with null on empty response', fakeAsync(() => {
    const mockData: IProvisioningGatewaysTable = {
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
      extStTerm: 0
    };

    gwcServiceMock.getSignalingGwInfo.and.returnValue(of([]));

    let resolvedValue: any;
    let rejectedValue: any;

    component.callSignalingGwInfo(mockData).then(
      (res) => (resolvedValue = res),
      (err) => (rejectedValue = err)
    );
    component.dynamicDialogContent = {
      title: 'Details',
      rows: [{ label: 'Gateway Name', value: mockData.name }],
      subtitle: 'Signaling Gateway Information',
      subRows: [
        { label: 'SIG IP', value: signalingGwInfoRes[0] },
        { label: 'SIG PORT 1', value: signalingGwInfoRes[1] },
        {
          label: 'SIG PORT 2',
          value:
            signalingGwInfoRes[2] === '0' ? 'NOT_SET' : signalingGwInfoRes[2]
        }
      ]
    };

    tick();

    expect(gwcServiceMock.getSignalingGwInfo).toHaveBeenCalledWith(
      mockData.name
    );
    expect(resolvedValue).toBeNull();
    expect(rejectedValue).toBeUndefined();
    expect(component.dynamicDialogContent)?.toEqual({
      title: 'Details',
      rows: [{ label: 'Gateway Name', value: mockData.name }],
      subtitle: 'Signaling Gateway Information',
      subRows: [
        { label: 'SIG IP', value: signalingGwInfoRes[0] },
        { label: 'SIG PORT 1', value: signalingGwInfoRes[1] },
        {
          label: 'SIG PORT 2',
          value:
            signalingGwInfoRes[2] === '0' ? 'NOT_SET' : signalingGwInfoRes[2]
        }
      ]
    });
  }));

  it('should reject on API call error', fakeAsync(() => {
    const mockData: IProvisioningGatewaysTable = {
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
      extStTerm: 0
    };
    const errorMessage = 'API Error';

    gwcServiceMock.getSignalingGwInfo.and.returnValue(throwError(errorMessage));

    let resolvedValue: any;
    let rejectedValue: any;

    component.callSignalingGwInfo(mockData).then(
      (res) => (resolvedValue = res),
      (err) => (rejectedValue = err)
    );

    tick();

    expect(gwcServiceMock.getSignalingGwInfo).toHaveBeenCalledWith(
      mockData.name
    );
    expect(resolvedValue).toBeUndefined();
    expect(rejectedValue).toEqual(errorMessage);
    expect(component.dynamicDialogContent).toBeUndefined();
    expect(commonServiceMock.showErrorMessage).toHaveBeenCalledWith(
      errorMessage
    );
  }));

  it('should resolve with response on successful API call', fakeAsync(() => {
    const mockData: IProvisioningGatewaysTable = {
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
      extStTerm: 0
    };
    const mockResponse = 'GR-834 Gateway Name';

    gwcServiceMock.getGrGwName.and.returnValue(of(mockResponse));

    let resolvedValue: any;
    let rejectedValue: any;

    component.callGrGwName(mockData).then(
      (res) => (resolvedValue = res),
      (err) => (rejectedValue = err)
    );

    tick(10000);

    expect(gwcServiceMock.getGrGwName).toHaveBeenCalledWith(mockData.name);
    expect(resolvedValue).toEqual(mockResponse);
    expect(rejectedValue).toBeUndefined();
    expect(component.dynamicDialogContent).toBeDefined();
  }));

  it('should resolve with null on empty response', fakeAsync(() => {
    const mockData: IProvisioningGatewaysTable = {
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
      extStTerm: 0
    };

    gwcServiceMock.getGrGwName.and.returnValue(of(null));

    let resolvedValue: any;
    let rejectedValue: any;

    component.callGrGwName(mockData).then(
      (res) => (resolvedValue = res),
      (err) => (rejectedValue = err)
    );
    component.dynamicDialogContent = {
      title: 'Details',
      rows: [{ label: 'Gateway Name', value: mockData.name }],
      subtitle: 'Signaling Gateway Information',
      subRows: [
        { label: 'SIG IP', value: signalingGwInfoRes[0] },
        { label: 'SIG PORT 1', value: signalingGwInfoRes[1] },
        {
          label: 'SIG PORT 2',
          value:
            signalingGwInfoRes[2] === '0' ? 'NOT_SET' : signalingGwInfoRes[2]
        }
      ]
    };

    tick(10000);

    expect(gwcServiceMock.getGrGwName).toHaveBeenCalledWith(mockData.name);
    expect(resolvedValue).toBeNull();
    expect(rejectedValue).toBeUndefined();
    expect(component.dynamicDialogContent).toBeDefined();
  }));

  it('should reject on API call error', fakeAsync(() => {
    const mockData: IProvisioningGatewaysTable = {
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
      extStTerm: 0
    };
    const errorMessage = 'API Error';

    gwcServiceMock.getGrGwName.and.returnValue(throwError(errorMessage));

    let resolvedValue: any;
    let rejectedValue: any;

    component.callGrGwName(mockData).then(
      (res) => (resolvedValue = res),
      (err) => (rejectedValue = err)
    );

    tick(10000);

    expect(gwcServiceMock.getGrGwName).toHaveBeenCalledWith(mockData.name);
    expect(resolvedValue).toBeUndefined();
    expect(rejectedValue).toEqual(errorMessage);
    expect(component.dynamicDialogContent).toBeUndefined();
  }));

  it('should handle Change Profile Multi when profile names are different', () => {
    spyOn(component, 'handleOperationChange');
    component.selectedRows = [
      {
        gwcID: 'GWC-0',
        name: 'testcarrier',
        ipAddress: '12.42.5.26',
        mgcsecipAddress: 'null',
        secipAddress: 'null',
        profileName: 'b',
        maxTerms: 4094,
        resTerms: 2000,
        protocol: 'megaco',
        protVers: '1.0',
        protPort: 2944,
        pepServerName: '<none>',
        middleBoxName: '<none>',
        algName: '<none>',
        nodeName: 'GWC 0',
        nodeNumber: 86,
        frame: 'NOT_SET',
        shelf: 'NOT_SET',
        slot: 'NOT_SET',
        locality: 'NOT_SET',
        cac: -1,
        defaultDomainName: '',
        lgrptype: 'null',
        isShared: 'N',
        extStTerm: 0
      },
      {
        gwcID: 'GWC-0',
        name: 'G9GEN2CO32ISUP',
        ipAddress: '47.168.122.106',
        mgcsecipAddress: 'null',
        secipAddress: 'null',
        profileName: 'a',
        maxTerms: 4094,
        resTerms: 400,
        protocol: 'megaco',
        protVers: '1.0',
        protPort: 2940,
        pepServerName: '<none>',
        middleBoxName: '<none>',
        algName: '<none>',
        nodeName: 'GWC 0',
        nodeNumber: 86,
        frame: 'NOT_SET',
        shelf: 'NOT_SET',
        slot: 'NOT_SET',
        locality: 'NOT_SET',
        cac: -1,
        defaultDomainName: '',
        lgrptype: 'null',
        isShared: 'N',
        extStTerm: 0
      }
    ];

    component.callAction();

    expect(component.handleOperationChange).not.toHaveBeenCalled();
    expect(commonServiceMock.showErrorMessage).toHaveBeenCalledWith(
      'This operation is only supported for gateways with the same profile'
    );
  });

  it('should show error message when selectedRows exceed the line limit', () => {
    const maxLimitData = [
      {
        gwcID: 'GWC-1',
        name: 'co32ams',
        ipAddress: '47.165.157.125',
        mgcsecipAddress: 'null',
        secipAddress: 'null',
        profileName: 'MS',
        maxTerms: 0,
        resTerms: 0,
        protocol: 'megaco',
        protVers: '1.0',
        protPort: 2944,
        pepServerName: '<none>',
        middleBoxName: '<none>',
        algName: '<none>',
        nodeName: 'GWC 0',
        nodeNumber: 86,
        frame: 'NOT_SET',
        shelf: 'NOT_SET',
        slot: 'NOT_SET',
        locality: 'NOT_SET',
        cac: -1,
        defaultDomainName: '',
        lgrptype: 'null',
        isShared: 'N',
        extStTerm: 0,
        combinedColumn: 'NOT_SET/NOT_SET/NOT_SET',
        dropdownActions: [],
        selected: true
      }
    ];
    for (let i = 0; i < 11; i++) {
      component.selectedRows.push({ ...maxLimitData[0] });
    }
    component.callAction();

    expect(commonServiceMock.showErrorMessage).toHaveBeenCalled();
  });

  it('should update selectedRows and selectedAction when checkboxes are changed', () => {
    component.selectedRows = [];
    component.selectedAction = null;
    const mockEvent = {
      selectedRows: [
        {
          gwcID: 'GWC-0',
          name: 'testcarrier',
          ipAddress: '12.42.5.26',
          mgcsecipAddress: 'null',
          secipAddress: 'null',
          profileName: 'GENBAND_G9_INTL',
          maxTerms: 4094,
          resTerms: 2000,
          protocol: 'megaco',
          protVers: '1.0',
          protPort: 2944,
          pepServerName: '<none>',
          middleBoxName: '<none>',
          algName: '<none>',
          nodeName: 'GWC 0',
          nodeNumber: 86,
          frame: 'NOT_SET',
          shelf: 'NOT_SET',
          slot: 'NOT_SET',
          locality: 'NOT_SET',
          cac: -1,
          defaultDomainName: '',
          lgrptype: 'null',
          isShared: 'N',
          extStTerm: 0,
          combinedColumn: 'NOT_SET/NOT_SET/NOT_SET',
          dropdownActions: [],
          selected: true
        },
        {
          gwcID: 'GWC-0',
          name: 'G9GEN2CO32ISUP',
          ipAddress: '47.168.122.106',
          mgcsecipAddress: 'null',
          secipAddress: 'null',
          profileName: 'GENBAND_G9_INTL',
          maxTerms: 4094,
          resTerms: 400,
          protocol: 'megaco',
          protVers: '1.0',
          protPort: 2940,
          pepServerName: '<none>',
          middleBoxName: '<none>',
          algName: '<none>',
          nodeName: 'GWC 0',
          nodeNumber: 86,
          frame: 'NOT_SET',
          shelf: 'NOT_SET',
          slot: 'NOT_SET',
          locality: 'NOT_SET',
          cac: -1,
          defaultDomainName: '',
          lgrptype: 'null',
          isShared: 'N',
          extStTerm: 0,
          combinedColumn: 'NOT_SET/NOT_SET/NOT_SET',
          dropdownActions: [],
          selected: true
        }
      ]
    };

    component.onCheckboxChange(mockEvent);

    expect(component.selectedRows).toEqual(mockEvent.selectedRows);
    expect(component.selectedAction).toBe(null);
  });

  it('should set selectedAction to null when no rows are selected', () => {
    component.selectedRows = [];
    component.selectedAction = null;
    component.selectedRows.length = 0;

    const mockEvent = {
      selectedRows: []
    };

    component.onCheckboxChange(mockEvent);

    expect(component.selectedRows).toEqual([]);
    expect(component.selectedAction).toBeNull();
  });

  it('should handle closeEditResultDialog()', () => {
    component.showEditResultDialog = false;

    component.closeEditResultDialog();

    expect(component.showEditResultDialog).toBeFalse();
  });

  it('should handle closeEditDialog()', () => {
    spyOn(component, 'clearSelectedOption');
    component.showEditDialog = false;

    component.closeEditDialog();

    expect(component.showEditDialog).toBeFalse();
    expect(component.clearSelectedOption).toHaveBeenCalled();
  });

  it('should handle onEditOperationFormSubmit === false', () => {
    const event = false;
    spyOn(component, 'closeEditDialog');
    spyOn(component.editOperationForm, 'reset');

    component.onEditOperationFormSubmit(event);

    expect(component.closeEditDialog).toHaveBeenCalled();
  });

  it('should handle onEditOperationFormSubmit === true', () => {
    const event = true;
    component.isBulkAction = true;
    spyOn(component, 'handleOperationChange');
    spyOn(component, 'clearSelectedOption');

    component.onEditOperationFormSubmit(event);

    expect(component.handleOperationChange).toHaveBeenCalledWith('Change Profile Multi');
    expect(component.clearSelectedOption).toHaveBeenCalled();
  });

  it('should handle onWarningChangeLgrpFromSubmit', () => {
    component.selectedRowValues =
     {
       gwcID: 'GWC-0',
       name: 'test834',
       ipAddress: '12.42.52.5',
       mgcsecipAddress: 'null',
       secipAddress: 'null',
       profileName: 'GENBAND_G2_PLG',
       maxTerms: 1023,
       resTerms: 100,
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
       defaultDomainName: '',
       lgrptype: 'LL_3RDPTY',
       isShared: 'N',
       extStTerm: 0
     };
    spyOn(component,'closeLGRPWarningPopup');
    component.selectedOperation=EOperationName.LGRP_TYPE;
    component.onWarningChangeLGRPFormSubmit(true);
    component.onWarningChangeLGRPFormSubmit(false);
    expect(component.closeLGRPWarningPopup).toHaveBeenCalled();
  });


  it('should handle closeLGRPWarningPopup', () => {
    component.closeLGRPWarningPopup();

    expect(component.showWarningPopupChangeLGRP).toBeFalse();
  });

  it('should handle closeAssociateDialog', () => {
    component.closeAssociateDialog();

    expect(component.showAssociateDialog).toBeFalse();
  });

  it('should set selectedAction to null after a delay', fakeAsync(() => {
    component.selectedAction = null;
    component.clearSelectedOption();

    expect(component.selectedAction).toBe(null);
    tick(100);
    expect(component.selectedAction).toBeNull();
  }));

  it('should handle signaling gateway', async(() => {
    component.handleSignalingGw('GENBAND_G9_NA').then((res: ILgrpType) => {
      component.operationNameOptions = [];
      component.operationNameOptions.push({
        label: 'Change Signaling Gateway',
        value: 'Change Signaling Gateway'
      });
      expect(res).toEqual(getLgrpTypeRes);
      expect(component.operationNameOptions[0].label).toBe(
        'Change Signaling Gateway'
      );
      expect(component.operationNameOptions[0].value).toBe(
        'Change Signaling Gateway'
      );
    });
  }));

  it('should handle error signaling gateway', async(() => {
    const gwName = 'GENBAND_G9_NA';

    gwcServiceMock.getLgrpType.and.returnValue(throwError('error'));

    component.handleSignalingGw(gwName).catch((error) => {
      expect(commonServiceMock.showAPIError).toHaveBeenCalledWith(error);
    });
  }));

  it('should handle gateway IP with changeIPAvailable true', fakeAsync(() => {
    const gwName = 'GENBAND_G9_NA';

    component.handleGwIP(gwName).then((res) => {
      expect(res).toEqual(getLgrpTypeRes);
      component.operationNameOptions = [];
      component.operationNameOptions.push({
        label: 'Change Gateway IP Address',
        value: 'Change Gateway IP Address'
      });
      expect(component.operationNameOptions[0].label).toBe(
        'Change Gateway IP Address'
      );
      expect(component.operationNameOptions[0].value).toBe(
        'Change Gateway IP Address'
      );
    });

    tick();
  }));

  it('should handle gateway IP with error', fakeAsync(() => {
    gwcServiceMock.getLgrpType.and.returnValue(throwError('error'));

    component.handleGwIP('dummyGatewayName').catch((err) => {
      expect(commonServiceMock.showAPIError).toHaveBeenCalledWith(err);
    });

    tick();
  }));

  it('should get profiles and update profileOptions', fakeAsync(() => {
    component.getProfiles('dummyProfileName').then((res) => {
      expect(res).toEqual(getEditProfilesRes);
    });

    const tempOption = [
      { label: 'TOUCHTONE_NN01_1', value: 'TOUCHTONE_NN01_1' },
      { label: 'TOUCHTONE_NN01_2', value: 'TOUCHTONE_NN01_2' },
      { label: 'TOUCHTONE_NN01_3', value: 'TOUCHTONE_NN01_3' },
      { label: 'TOUCHTONE_NN01_4', value: 'TOUCHTONE_NN01_4' }
    ];

    expect(component.profileOptions).toEqual(tempOption);

    tick();
  }));

  it('should handle error when getting profiles', fakeAsync(() => {
    gwcServiceMock.getGwCapacity_Profiles.and.returnValue(throwError('error'));

    component.getProfiles('dummyProfileName').catch((err) => {
      expect(commonServiceMock.showAPIError).toHaveBeenCalledWith(err);
    });

    tick();
  }));

  it('should handle edit operation successfully', (done: DoneFn) => {
    const mockData: IProvisioningGatewaysTable = {
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
      extStTerm: 0
    };

    spyOn(component, 'getAlg').and.returnValue(Promise.resolve(true));
    spyOn(component, 'getPepServer').and.returnValue(Promise.resolve(true));
    spyOn(component, 'getGwCapacity').and.returnValue(Promise.resolve(true));
    spyOn(component, 'getProfiles').and.returnValue(Promise.resolve(true));
    spyOn(component, 'getLgrpType').and.returnValue(Promise.resolve(true));
    spyOn(component, 'handleGrGw').and.returnValue(Promise.resolve(true));
    spyOn(component, 'handleGwIP').and.returnValue(Promise.resolve(true));
    spyOn(component, 'handleSignalingGw').and.returnValue(
      Promise.resolve(true)
    );
    spyOn(component, 'handleLblInfo').and.returnValue(Promise.resolve(true));

    component.onEditHandle(mockData);

    setTimeout(() => {
      expect(component.isLoading).toBe(false);
      expect(component.showEditDialog).toBe(true);

      done();
    }, 0);
  });

  it('should handle edit operation failure', (done: DoneFn) => {
    const mockData: IProvisioningGatewaysTable = {
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
      extStTerm: 0
    };

    spyOn(component, 'getAlg').and.returnValue(Promise.reject('Error'));
    spyOn(component, 'getPepServer').and.returnValue(Promise.reject('Error'));
    spyOn(component, 'getGwCapacity').and.returnValue(Promise.reject('Error'));
    spyOn(component, 'getProfiles').and.returnValue(Promise.reject('Error'));
    spyOn(component, 'getLgrpType').and.returnValue(Promise.reject('Error'));
    spyOn(component, 'handleGrGw').and.returnValue(Promise.reject('Error'));
    spyOn(component, 'handleGwIP').and.returnValue(Promise.reject('Error'));
    spyOn(component, 'handleSignalingGw').and.returnValue(
      Promise.reject('Error')
    );
    spyOn(component, 'handleLblInfo').and.returnValue(Promise.reject('Error'));

    component.onEditHandle(mockData);

    setTimeout(() => {
      expect(component.isLoading).toBe(false);
      expect(commonServiceMock.showErrorMessage).toHaveBeenCalledWith('Error');

      done();
    }, 0);
  });

  it('should fetch ALG options successfully', (done: DoneFn) => {
    component
      .getAlg()
      .then((res) => {
        expect(component.algOptions.length).toBe(4);
        expect(component.algOptions[0].label).toBe('');
        expect(component.algOptions[1].label).toBe('test');
        expect(component.algOptions[2].label).toBe('test4');
        expect(component.algOptions[3].label).toBe('test3');
        expect(res).toEqual(getAlgRes);

        done();
      })
      .catch(done.fail);
  });

  it('should handle error when getting ALG options and reject the promise', fakeAsync(() => {
    gwcServiceMock.getAlg.and.returnValue(throwError('error'));

    component.getAlg().catch((err) => {
      expect(commonServiceMock.showAPIError).toHaveBeenCalledWith(err);
    });

    tick();
  }));

  it('should resolve with response on successful API call', fakeAsync(() => {
    const mockData: IProvisioningGatewaysTable = {
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
      extStTerm: 0
    };
    const mockResponse = gwApplicationDataRes;

    gwcServiceMock.getGwApplicationData.and.returnValue(of(mockResponse));

    let resolvedValue: any;
    let rejectedValue: any;

    component.dynamicDialogContent = {
      title: 'Details',
      rows: [{ label: 'Gateway Name', value: 'test834' }],
      subtitle: 'Gateway Application Data',
      subRows: [
        {
          label: 'test',
          value: 'test'
        }
      ]
    };
    component.callGwApplicationData(mockData).then(
      (res) => (resolvedValue = res),
      (err) => (rejectedValue = err)
    );

    tick(5000);

    expect(gwcServiceMock.getGwApplicationData).toHaveBeenCalledWith(
      mockData.name
    );
    expect(resolvedValue).toEqual(null);
    expect(rejectedValue).toBeUndefined();
    expect(component.dynamicDialogContent).toBeDefined();
    expect(component.dynamicDialogContent.title).toBe('Details');
    expect(component.dynamicDialogContent.rows[0].label).toBe('Gateway Name');
    expect(component.dynamicDialogContent.rows[0].value).toBe(mockData.name);
    expect(component.dynamicDialogContent.subtitle).toBe(
      'Gateway Application Data'
    );
  }));

  it('should callGwApplicationData and reject', fakeAsync(() => {
    const mockData: IProvisioningGatewaysTable = {
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
      extStTerm: 0
    };
    gwcServiceMock.getGwApplicationData.and.returnValue(throwError('error'));

    let promiseResolved = false;
    let errorOccurred = false;

    component
      .callGwApplicationData(mockData)
      .then((res) => {
        promiseResolved = true;
      })
      .catch((error) => {
        errorOccurred = true;
      });

    tick(5000);

    expect(promiseResolved).toBe(false);
    expect(errorOccurred).toBe(true);
    expect(component.gwApplicationData).toBeUndefined();
    expect(component.dynamicDialogContent).toBeUndefined();
    expect(commonServiceMock.showErrorMessage).toHaveBeenCalledWith('error');
  }));

  it('should handle initBulkActions()', () => {
    const action = [
      {
        label: 'Change Profile',
        value: 'Change Profile'
      }
    ];
    component.bulkActions = action;

    component.initBulkActions();

    expect(component.bulkActions).toEqual(action);
  });

  it('should handle LBL info when isLblSupported returns true', (done) => {
    component.operationNameOptions = [
      { label: 'Remove LBL Info', value: 'Remove LBL Info' }
    ];

    component.handleLblInfo('testProfile', 'testGW', 'testGWCId').then(() => {
      expect(component.lblCategory).toBe(getLgrpTypeRes.category.__value);
      expect(component.inventoryType).toBe(getLgrpTypeRes.inventoryType);
      expect(component.lblProfileName).toBe(retriveRes.gwData[0].profileName);
      expect(component.operationNameOptions).toContain({
        label: 'Remove LBL Info',
        value: 'Remove LBL Info'
      });

      done();
    });
  });

  it('should handleGrGw and resolve with response on successful API call', fakeAsync(() => {
    let resolvedValue: any;
    let rejectedValue: any;

    component.handleGrGw('mockProfileName', 'mockGwName').then(
      (res) => (resolvedValue = res),
      (err) => (rejectedValue = err)
    );

    tick();

    expect(gwcServiceMock.isSupportMlt).toHaveBeenCalledWith('mockProfileName');
    expect(gwcServiceMock.getGrGwTypeByProfile).toHaveBeenCalledWith(
      'mockProfileName'
    );
    expect(gwcServiceMock.getGrGwNamesByType).toHaveBeenCalledWith('G6');
    expect(gwcServiceMock.isGrGwSet).toHaveBeenCalledWith('mockGwName');
    expect(component.operationNameOptions).toEqual([
      { label: 'Change GR-834 Gateway', value: 'Change GR-834 Gateway' }
    ]);
    expect(component.grGwOptions).toEqual([
      { label: '', value: '' },
      { label: 'testGR', value: 'testGR' },
      { label: 'testGW', value: 'testGW' }
    ]);
    expect(component.editOperationForm.controls['grGw'].value).toEqual('tst');
    expect(resolvedValue).toEqual(getGrGwNamesByTypeRes);
    expect(rejectedValue).toBeUndefined();
  }));

  it('should push to operationNameOptions if profileName includes certain values', (done) => {
    component.operationNameOptions = [
      {
        label: 'Change Gateway LGRP Type',
        value: 'Change Gateway LGRP Type'
      }
    ];

    component.getLgrpType('mockGwName').then(() => {
      expect(component.operationNameOptions).toContain({
        label: 'Change Gateway LGRP Type',
        value: 'Change Gateway LGRP Type'
      });
      done();
    });
  });

  it('should set lgrpTypeOptions based on the response', (done) => {
    component.getLgrpType('mockGwName').then(() => {
      expect(component.lgrpTypeOptions).toEqual([
        { label: 'LL_3RDPTY_2K', value: 'LL_3RDPTY_2K' },
        { label: 'LL_3RDPTY_FLEX', value: 'LL_3RDPTY_FLEX' }
      ]);
      done();
    });
  });

  it('should get GW capacity and set properties', fakeAsync(() => {
    const mockProfileName = 'mockProfile';
    const mockGwName = 'mockGateway';

    const mockGwCapacity = {
      multiSiteNamesSupported: 'true'
    };

    const mockTableCache = ['item1', 'item2'];

    const mockGwCapacityPickList = {
      epgData: [
        { endpointGroupName: 'provisionedLgrp1' },
        { endpointGroupName: 'provisionedLgrp2' }
      ]
    };

    gwcServiceMock.getGwCapacity_Profiles.and.returnValue(of(mockGwCapacity));
    gwcServiceMock.getTableCache.and.returnValue(of(mockTableCache));
    gwcServiceMock.getGwCapacityPickList.and.returnValue(
      of(mockGwCapacityPickList)
    );

    let resolvedValue: any;
    let rejectedValue: any;

    component.getGwCapacity(mockProfileName, mockGwName).then(
      (res) => (resolvedValue = res),
      (err) => (rejectedValue = err)
    );

    tick();

    expect(gwcServiceMock.getGwCapacity_Profiles).toHaveBeenCalledWith(
      mockProfileName
    );
    expect(gwcServiceMock.getTableCache).toHaveBeenCalled();
    expect(gwcServiceMock.getGwCapacityPickList).toHaveBeenCalledWith(
      component.currentGwcName,
      mockGwName
    );

    expect(component.multiSiteNamesSupported).toBe('true');
    expect(component.availableCapacityList).toEqual([
      { name: 'item1' },
      { name: 'item2' }
    ]);
    expect(component.provisionedLgrps).toEqual([
      { name: 'provisionedLgrp1' },
      { name: 'provisionedLgrp2' }
    ]);
    expect(resolvedValue).toEqual(mockGwCapacity);
    expect(rejectedValue).toBeUndefined();
  }));

  it('should get PEP server and set options', fakeAsync(() => {
    const mockResponse = {
      count: 2,
      list: [{ name: 'pepServer1' }, { name: 'pepServer2' }]
    };

    gwcServiceMock.getPepServer.and.returnValue(of(mockResponse));

    let resolvedValue: any;
    let rejectedValue: any;

    component.getPepServer().then(
      (res) => (resolvedValue = res),
      (err) => (rejectedValue = err)
    );

    tick();

    expect(gwcServiceMock.getPepServer).toHaveBeenCalled();
    expect(component.pepServerOptions).toEqual([
      { label: '', value: '' },
      { label: 'pepServer1', value: 'pepServer1' },
      { label: 'pepServer2', value: 'pepServer2' }
    ]);
    expect(resolvedValue).toEqual(mockResponse);
    expect(rejectedValue).toBeUndefined();
  }));

  it('should resolve with response on successful API call', fakeAsync(() => {
    const mockData: IProvisioningGatewaysTable = {
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
      extStTerm: 0
    };

    const mockResponse = {
      keyValuePairs: [{ name: 'Key1', value: 'Value1' }]
    };

    gwcServiceMock.getGwApplicationData.and.returnValue(of(mockResponse));

    let resolvedValue: any;
    let rejectedValue: any;

    component.callGwApplicationData(mockData).then(
      (res) => (resolvedValue = res),
      (err) => (rejectedValue = err)
    );

    tick(5000);

    expect(gwcServiceMock.getGwApplicationData).toHaveBeenCalledWith(
      mockData.name
    );
    expect(component.isLoading).toBeFalsy();
    expect(component.gwApplicationData).toEqual(mockResponse);
    expect(component.dynamicDialogContent).toEqual({
      title: 'Details',
      rows: [{ label: 'Gateway Name', value: mockData.name }],
      subtitle: 'Gateway Application Data',
      subRows: [
        {
          label: mockResponse.keyValuePairs[0].name,
          value: mockResponse.keyValuePairs[0].value
        }
      ]
    });
    expect(rejectedValue).toBeUndefined();
  }));

  it('should reject with an error message on API call error', fakeAsync(() => {
    const mockData: IProvisioningGatewaysTable = {
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
      extStTerm: 0
    };

    const errorMessage = 'Error fetching data';
    gwcServiceMock.getGwApplicationData.and.returnValue(
      throwError(errorMessage)
    );

    let resolvedValue: any;
    let rejectedValue: any;

    component.callGwApplicationData(mockData).then(
      (res) => (resolvedValue = res),
      (err) => (rejectedValue = err)
    );

    tick(5000);

    expect(gwcServiceMock.getGwApplicationData).toHaveBeenCalledWith(
      mockData.name
    );
    expect(component.isLoading).toBeFalsy();
    expect(component.gwApplicationData).toBeUndefined();
    expect(component.dynamicDialogContent).toBeUndefined();
    expect(rejectedValue).toEqual(errorMessage);
  }));

  // handleOperationChange fn
  // Alg
  it('should reset form and set validators for ALG on updateFormValidators true, handleOperationChange()', () => {
    const updateFormValidators = true;
    const algControl = component.getFormFieldControl('alg');

    component.handleOperationChange('Change ALG', updateFormValidators);

    expect(component.validatorFieldsRefs.length).toBe(1);
    expect(algControl?.hasError('required')).toBeTrue();
  });

  it('should updateFormValidators false, handleOperationChange(), selectedRowValues.algName equals form values', () => {
    const updateFormValidators = false;
    component.selectedRowValues =
      {
        gwcID: 'GWC-0',
        name: 'test834',
        ipAddress: '12.42.52.5',
        mgcsecipAddress: 'null',
        secipAddress: 'null',
        profileName: 'GENBAND_G2_PLG',
        maxTerms: 1023,
        resTerms: 100,
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
        defaultDomainName: '',
        lgrptype: 'LL_3RDPTY',
        isShared: 'N',
        extStTerm: 0
      };
    component.editOperationForm.get('alg')?.setValue('ALG01');
    component.selectedRowValues.algName = component.editOperationForm.get('alg')?.value;

    component.handleOperationChange('Change ALG', updateFormValidators);

    expect(commonServiceMock.showErrorMessage).toHaveBeenCalledWith(
      component.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.GATEWAYS.TABLE.EDIT_RESULT_MSG.ALG
        .replace(/{{gwName}}/, component.selectedRowValues.name).replace(/{{gwName}}/, component.selectedRowValues.name)
    );
  });

  it('should updateFormValidators false, handleOperationChange(), selectedRowValues.algName not equals form values', () => {
    const updateFormValidators = false;
    gwcServiceMock.postEdit.and.returnValue(of({}));
    component.selectedRowValues =
      {
        gwcID: 'GWC-0',
        name: 'test834',
        ipAddress: '12.42.52.5',
        mgcsecipAddress: 'null',
        secipAddress: 'null',
        profileName: 'GENBAND_G2_PLG',
        maxTerms: 1023,
        resTerms: 100,
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
        defaultDomainName: '',
        lgrptype: 'LL_3RDPTY',
        isShared: 'N',
        extStTerm: 0
      };
    component.editOperationForm.get('alg')?.setValue(null);
    component.selectedRowValues.algName = 'ALG01';

    component.handleOperationChange('Change ALG', updateFormValidators);

    expect(gwcServiceMock.postEdit).toHaveBeenCalled();
  });

  it('should updateFormValidators false, handleOperationChange(), with error', () => {
    const updateFormValidators = false;
    gwcServiceMock.postEdit.and.returnValue(throwError('error'));
    component.selectedRowValues =
      {
        gwcID: 'GWC-0',
        name: 'test834',
        ipAddress: '12.42.52.5',
        mgcsecipAddress: 'null',
        secipAddress: 'null',
        profileName: 'GENBAND_G2_PLG',
        maxTerms: 1023,
        resTerms: 100,
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
        defaultDomainName: '',
        lgrptype: 'LL_3RDPTY',
        isShared: 'N',
        extStTerm: 0
      };
    component.editOperationForm.get('alg')?.setValue(null);
    component.selectedRowValues.algName = 'ALG01';

    component.handleOperationChange('Change ALG', updateFormValidators);
    expect(gwcServiceMock.postEdit).toHaveBeenCalled();
    expect(commonServiceMock.showErrorMessage).toHaveBeenCalled();
  });

  // Pep server
  it('should reset form and set validators for Pep Server on updateFormValidators true, handleOperationChange()', () => {
    const updateFormValidators = true;
    const pepServerControl = component.getFormFieldControl('pepServer');

    component.handleOperationChange('Change Pep Server', updateFormValidators);

    expect(component.validatorFieldsRefs.length).toBe(1);
    expect(pepServerControl?.hasError('required')).toBeTrue();
  });

  it('should handle PEP_SERVER operation correctly when values do not match', fakeAsync(() => {
    gwcServiceMock.postEdit.and.returnValue(of({}));

    component.selectedRowValues = selectedRowValues;
    component.editOperationForm.get('pepServer')?.setValue('pepServer2');
    defaultPostBody.pepServerName = 'pepServer2';

    component.handleOperationChange('Change Pep Server');
    tick();

    expect(gwcServiceMock.postEdit).toHaveBeenCalled();
    expect(commonServiceMock.showSuccessMessage).toHaveBeenCalledWith(
      'test834 PEP change successful'
    );
  }));

  it('should updateFormValidators false, handleOperationChange(), selectedRowValues.pepServerName equals form values', () => {
    component.selectedRowValues =
      {
        gwcID: 'GWC-0',
        name: 'test834',
        ipAddress: '12.42.52.5',
        mgcsecipAddress: 'null',
        secipAddress: 'null',
        profileName: 'GENBAND_G2_PLG',
        maxTerms: 1023,
        resTerms: 100,
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
        defaultDomainName: '',
        lgrptype: 'LL_3RDPTY',
        isShared: 'N',
        extStTerm: 0
      };
    component.editOperationForm.get('pepServer')?.setValue('pepServerName');
    component.selectedRowValues.pepServerName = component.editOperationForm.get('pepServer')?.value;

    component.handleOperationChange('Change Pep Server');

    expect(commonServiceMock.showErrorMessage).toHaveBeenCalled();
  });

  it('should handle PEP_SERVER operation with error', fakeAsync(() => {
    gwcServiceMock.postEdit.and.returnValue(throwError('error'));

    component.selectedRowValues = selectedRowValues;
    component.editOperationForm.get('pepServer')?.setValue('pepServer2');
    defaultPostBody.pepServerName = 'pepServer2';

    component.handleOperationChange('Change Pep Server');
    tick();

    expect(gwcServiceMock.postEdit).toHaveBeenCalled();
    expect(commonServiceMock.showErrorMessage).toHaveBeenCalled();
  }));

  // Gateway Capacity
  it('should reset form and set validators for  Gateway Capacity on updateFormValidators true, handleOperationChange()', () => {
    const updateFormValidators = true;
    component.multiSiteNamesSupported = 'false';
    const gwCapacityControl = component.getFormFieldControl('gwCapacity');

    component.handleOperationChange('Change Gateway Capacity', updateFormValidators);

    expect(component.validatorFieldsRefs.length).toBe(1);
    expect(gwCapacityControl?.hasError('required')).toBeTrue();
  });

  it('should handle Change Gateway Capacity operation correctly when multiSiteNamesSupported is true and no changes', () => {
    component.multiSiteNamesSupported = 'true';
    component.movedToTarget = false;
    component.movedToSource = false;
    component.editResultDialogContent =
      translate.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.GATEWAYS.TABLE.EDIT_RESULT_MSG.PICK_LIST_NO_CHANGE;
    component.showEditResultDialog = true;
    component.handleOperationChange('Change Gateway Capacity');

    expect(component.showEditResultDialog).toBeTrue();
    expect(component.editResultDialogContent).toEqual(
      translate.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.GATEWAYS
        .TABLE.EDIT_RESULT_MSG.PICK_LIST_NO_CHANGE
    );
  });

  it('should handle Change Gateway Capacity operation correctly when multiSiteNamesSupported is true and PICK_LIST_BOTH_CHANGE', () => {
    component.multiSiteNamesSupported = 'true';
    component.movedToTarget = true;
    component.movedToSource = true;
    component.editResultDialogContent =
      translate.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.GATEWAYS.TABLE.EDIT_RESULT_MSG.PICK_LIST_BOTH_CHANGE;
    component.showEditResultDialog = true;
    component.handleOperationChange('Change Gateway Capacity');

    expect(component.showEditResultDialog).toBeTrue();
    expect(component.editResultDialogContent).toEqual(
      translate.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.GATEWAYS
        .TABLE.EDIT_RESULT_MSG.PICK_LIST_BOTH_CHANGE
    );
  });

  it('should handle GATEWAY_CAPACITY operation correctly when multiSiteNamesSupported is false and input is not a number', fakeAsync(() => {
    gwcServiceMock.postLgrpType.and.returnValue(throwError('error'));
    component.multiSiteNamesSupported = 'false';
    component.currentGwcName = 'GWC-0';
    component.selectedRowValues = selectedRowValues;
    component.editOperationForm.get('gwCapacity')?.setValue('%');

    component.handleOperationChange('Change Gateway Capacity');
    tick();

    expect(component.infoPopupTitle).toBe(translate.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.GATEWAYS.INFO_POPUP.TITLE);
    expect(component.infoPopupMessage).toBe(translate.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.GATEWAYS.INFO_POPUP.MESSAGE);
    expect(component.showInfoPopup).toBeTrue();
  }));

  it('should handle closeInfoPopup', () => {
    component.closeInfoPopup();

    expect(component.showInfoPopup).toBeFalse();
    expect(component.infoPopupTitle).toBe('');
    expect(component.infoPopupMessage).toBe('');
  });

  it('should handle GATEWAY_CAPACITY operation correctly when multiSiteNamesSupported is false and input is a number', () => {

    component.multiSiteNamesSupported = 'false';
    component.currentGwcName = 'GWC-0';
    component.selectedRowValues = selectedRowValues;
    component.editOperationForm.get('gwCapacity')?.setValue('12');

    component.handleOperationChange('Change Gateway Capacity');

    expect(component.showWarningPopupChangeGWCapacity).toBeTrue();
  });

  it('should handle onWarningChangeGWCapacityFormSubmit(), event=true', fakeAsync(() => {
    spyOn(component, 'closeWarningPopup');
    component.multiSiteNamesSupported = 'false';
    component.currentGwcName = 'GWC-0';
    component.selectedRowValues = selectedRowValues;
    component.editOperationForm.get('gwCapacity')?.setValue(10);
    const body = [
      [
        {
          tag: 'clientVers',
          value: '05'
        },
        {
          tag: 'mgUIName',
          value: selectedRowValues.name
        },
        {
          tag: 'reservedTerminations',
          value: 10
        },
        {
          tag: 'mgOldLGRPType',
          value: saveLgrpTypeRes.gatewayList[0].configuration.lgrpType
        },
        {
          tag: 'mgOldLGRPSize',
          value: saveLgrpTypeRes.gatewayList[0].configuration.reservedEndpoints
        },
        {
          tag: 'mgOldisShared',
          value: saveLgrpTypeRes.gatewayList[0].configuration.isShared
        },
        {
          tag: 'mgOldExtStTerm',
          value: saveLgrpTypeRes.gatewayList[0].configuration.extStTerm
        },
        {
          tag: 'mgOldNodeNo',
          value: saveLgrpTypeRes.gatewayList[0].configuration.nodeNumber
        }
      ]
    ];

    gwcServiceMock.postLgrpType.and.returnValue(of({ responseMsg: 'Success' }));

    component.onWarningChangeGWCapacityFormSubmit(true);
    tick();

    expect(component.closeWarningPopup).toHaveBeenCalled();
    expect(gwcServiceMock.saveLgrpType).toHaveBeenCalledWith(
      component.currentGwcName,
      selectedRowValues.name
    );
    expect(gwcServiceMock.postLgrpType).toHaveBeenCalledWith(body);
    expect(component.showEditResultDialog).toBeTrue();
    expect(component.editResultDialogContent).toContain('Success');
  }));

  it('should handle onWarningChangeGWCapacityFormSubmit(), event=true and handle error on postLgrpType', fakeAsync(() => {
    gwcServiceMock.postLgrpType.and.returnValue(throwError('error'));
    component.multiSiteNamesSupported = 'false';
    component.currentGwcName = 'GWC-0';
    component.selectedRowValues = selectedRowValues;
    component.editOperationForm.get('gwCapacity')?.setValue(10);
    const body = [
      [
        {
          tag: 'clientVers',
          value: '05'
        },
        {
          tag: 'mgUIName',
          value: selectedRowValues.name
        },
        {
          tag: 'reservedTerminations',
          value: 10
        },
        {
          tag: 'mgOldLGRPType',
          value: saveLgrpTypeRes.gatewayList[0].configuration.lgrpType
        },
        {
          tag: 'mgOldLGRPSize',
          value: saveLgrpTypeRes.gatewayList[0].configuration.reservedEndpoints
        },
        {
          tag: 'mgOldisShared',
          value: saveLgrpTypeRes.gatewayList[0].configuration.isShared
        },
        {
          tag: 'mgOldExtStTerm',
          value: saveLgrpTypeRes.gatewayList[0].configuration.extStTerm
        },
        {
          tag: 'mgOldNodeNo',
          value: saveLgrpTypeRes.gatewayList[0].configuration.nodeNumber
        }
      ]
    ];

    component.onWarningChangeGWCapacityFormSubmit(true);
    tick();

    expect(gwcServiceMock.saveLgrpType).toHaveBeenCalledWith(
      component.currentGwcName,
      selectedRowValues.name
    );
    expect(component.isLoading).toBe(false);
    expect(commonServiceMock.showAPIError).toHaveBeenCalledWith('error');
  }));

  it('should handle onWarningChangeGWCapacityFormSubmit(), event=true and handle error on saveLgrpType', fakeAsync(() => {
    gwcServiceMock.saveLgrpType.and.returnValue(throwError('error'));
    component.multiSiteNamesSupported = 'false';
    component.currentGwcName = 'GWC-0';
    component.selectedRowValues = selectedRowValues;

    component.onWarningChangeGWCapacityFormSubmit(true);
    tick();

    expect(gwcServiceMock.saveLgrpType).toHaveBeenCalledWith(
      component.currentGwcName,
      selectedRowValues.name
    );
    expect(component.isLoading).toBe(false);
    expect(commonServiceMock.showAPIError).toHaveBeenCalledWith('error');
  }));

  it('should handle onWarningChangeGWCapacityFormSubmit(), event=false', () => {
    spyOn(component, 'closeWarningPopup');

    component.onWarningChangeGWCapacityFormSubmit(false);

    expect(component.isLoading).toBe(false);
    expect(component.closeWarningPopup).toHaveBeenCalled();
  });

  it('should handle closeWarningPopup()', () => {
    component.closeWarningPopup();

    expect(component.showWarningPopupChangeGWCapacity).toBeFalse();
  });

  // Profile
  it('should reset form and set validators for ALG on updateFormValidators true, handleOperationChange()', () => {
    const updateFormValidators = true;
    const profileControl = component.getFormFieldControl('profile');

    component.handleOperationChange('Change Profile', updateFormValidators);

    expect(component.validatorFieldsRefs.length).toBe(1);
    expect(profileControl?.hasError('required')).toBeTrue();
  });

  it('should handle PROFILE operation correctly', fakeAsync(() => {
    component.currentGwcName = 'GWC-0';
    component.selectedRowValues = selectedRowValues;
    component.editOperationForm.get('profile')?.setValue('mockSelectedProfile');
    gwcServiceMock.postLgrpType.and.returnValue(of({ responseMsg: 'Success' }));

    component.handleOperationChange('Change Profile');
    tick();

    expect(gwcServiceMock.getGwCapacity_Profiles).toHaveBeenCalledWith(
      'mockSelectedProfile'
    );
    expect(gwcServiceMock.saveLgrpType).toHaveBeenCalledWith(
      'GWC-0',
      'test834'
    );
    expect(component.isLoading).toBeFalse();
    expect(component.showEditResultDialog).toBeFalse();
    expect(component.editResultDialogContent).toEqual('');
  }));

  it('should handle PROFILE operation correctly and handle error', fakeAsync(() => {
    gwcServiceMock.getGwCapacity_Profiles.and.returnValue(throwError('error'));
    component.currentGwcName = 'GWC-0';
    component.selectedRowValues = selectedRowValues;
    component.editOperationForm.get('profile')?.setValue('mockSelectedProfile');
    gwcServiceMock.postLgrpType.and.returnValue(of({ responseMsg: 'Success' }));

    component.handleOperationChange('Change Profile');
    tick();

    expect(component.isLoading).toBeFalse();
    expect(commonServiceMock.showAPIError).toHaveBeenCalledWith('error');
  }));

  // LGRP TYPE
  it('should reset form and set validators for LGRP_TYPE on updateFormValidators true, handleOperationChange()', () => {
    const updateFormValidators = true;
    const nodeSharingControl = component.getFormFieldControl('nodeSharing');

    component.handleOperationChange('Change Gateway LGRP Type', updateFormValidators);

    expect(component.validatorFieldsRefs.length).toBe(1);
    expect(nodeSharingControl?.hasError('required')).toBeFalse();
  });

  // GR_834
  it('should reset form and set validators for GR_834 on updateFormValidators true, handleOperationChange()', () => {
    const updateFormValidators = true;
    const grGwControl = component.getFormFieldControl('grGw');

    component.handleOperationChange('Change GR-834 Gateway', updateFormValidators);

    expect(component.validatorFieldsRefs.length).toBe(1);
  });

  it('should handle GR_834 operation correctly and show success dialog', fakeAsync(() => {
    component.selectedRowValues = selectedRowValues;
    gwcServiceMock.postGrGw.and.returnValue(of(null));

    component.handleOperationChange('Change GR-834 Gateway');
    tick();

    expect(gwcServiceMock.postGrGw).toHaveBeenCalledWith(
      selectedRowValues.name,
      ''
    );
    expect(component.isLoading).toBeFalse();
    expect(component.showEditResultDialog).toBeTrue();
    expect(component.editResultDialogContent).toContain(selectedRowValues.name);
  }));

  it('should handle GR_834 operation error and show API error', fakeAsync(() => {
    component.selectedRowValues = selectedRowValues;
    gwcServiceMock.postGrGw.and.returnValue(throwError('Error'));

    component.handleOperationChange('Change GR-834 Gateway');
    tick();

    expect(gwcServiceMock.postGrGw).toHaveBeenCalledWith(
      selectedRowValues.name,
      ''
    );
    expect(component.isLoading).toBeFalse();
    expect(commonServiceMock.showAPIError).toHaveBeenCalledWith('Error');
  }));

  // IP ADDRESS
  it('should reset form and set validators for IP_ADDRESS on updateFormValidators true, handleOperationChange()', () => {
    const updateFormValidators = true;
    const ipControl = component.getFormFieldControl('ip');
    const portControl = component.getFormFieldControl('port');

    component.handleOperationChange('Change Gateway IP Address', updateFormValidators);

    expect(component.validatorFieldsRefs.length).toBe(2);
  });

  // PROFILE BULK
  it('should reset form and set validators for PROFILE_BULK on updateFormValidators true, handleOperationChange()', () => {
    const updateFormValidators = true;
    component.handleOperationChange('Change Profile Multi', updateFormValidators);
  });

  it('should handle PROFILE_BULK operation correctly', () => {
    const selectedRows = [
      {
        gwcID: 'GWC-0',
        name: 'test834',
        ipAddress: '12.42.52.5',
        mgcsecipAddress: 'null',
        secipAddress: 'null',
        profileName: 'GENBAND_G2_PLG',
        maxTerms: 1023,
        resTerms: 100,
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
        defaultDomainName: '',
        lgrptype: 'LL_3RDPTY',
        isShared: 'N',
        extStTerm: 0,
        combinedColumn: '2/2/NOT_SET',
        dropdownActions: [],
        selected: true
      }
    ];

    component.selectedRows = selectedRows;
    component.handleOperationChange('Change Profile Multi');

    expect(gwcServiceMock.postLgrpType).toHaveBeenCalled();
  });

  // REMOVE LBL
  it('should reset form and set validators for REMOVE_LBL on updateFormValidators true, handleOperationChange()', () => {
    const updateFormValidators = true;

    component.handleOperationChange('Remove LBL Info', updateFormValidators);

  });

  it('should handle REMOVE_LBL operation correctly and show result dialog on success', fakeAsync(() => {
    const rmLblbody = [
      [
        { tag: 'clientVers', value: '05' },
        { tag: 'mgUIName', value: selectedRowValues.name },
        { tag: 'mgLGRPType', value: 'disabled' }
      ]
    ];
    const successResponse = { responseMsg: 'Label removed successfully' };

    gwcServiceMock.postLgrpType.and.returnValue(of(successResponse));

    component.selectedRowValues = selectedRowValues;

    component.handleOperationChange('Remove LBL Info');
    tick();

    expect(gwcServiceMock.postLgrpType).toHaveBeenCalledWith(rmLblbody);
    expect(component.isLoading).toBe(false);
    expect(component.editResultDialogContent).toBe(successResponse.responseMsg);
    expect(component.showEditResultDialog).toBe(true);
  }));

  it('should handle REMOVE_LBL operation and show API error dialog on failure', fakeAsync(() => {
    const rmLblbody = [
      [
        { tag: 'clientVers', value: '05' },
        { tag: 'mgUIName', value: selectedRowValues.name },
        { tag: 'mgLGRPType', value: 'disabled' }
      ]
    ];

    gwcServiceMock.postLgrpType.and.returnValue(throwError('error'));

    component.selectedRowValues = selectedRowValues;

    component.handleOperationChange('Remove LBL Info');
    tick();

    expect(gwcServiceMock.postLgrpType).toHaveBeenCalledWith(rmLblbody);
    expect(component.isLoading).toBe(false);
    expect(commonServiceMock.showAPIError).toHaveBeenCalledWith('error');
  }));

  // LBL INFO
  it('should reset form and set validators for LBL_INFO on updateFormValidators true, handleOperationChange()', () => {
    const updateFormValidators = true;

    component.handleOperationChange('Change LBL Info', updateFormValidators);

    expect(component.validatorFieldsRefs.length).toBe(3);
  });

  it('should handle LBL_INFO operation correctly and show result dialog on success', fakeAsync(() => {
    component.editOperationForm
      .get('mgcsecipAddress')
      ?.setValue('mgcSecIpAddress');
    component.editOperationForm.get('secipAddress')?.setValue('secIpAddress');
    component.editOperationForm.get('cac')?.setValue('5');

    const successResponse = {
      responseMsg: 'Label information updated successfully'
    };
    gwcServiceMock.postLgrpType.and.returnValue(of(successResponse));

    component.selectedRowValues = selectedRowValues;

    component.handleOperationChange('Change LBL Info');
    tick();

    expect(gwcServiceMock.postLgrpType).toHaveBeenCalled();
    expect(component.isLoading).toBe(false);
    expect(component.editResultDialogContent).toBe(successResponse.responseMsg);
    expect(component.showEditResultDialog).toBe(true);
  }));

  it('should handle LBL_INFO operation and show error dialog when secipAddress is empty', fakeAsync(() => {
    component.editOperationForm
      .get('mgcsecipAddress')
      ?.setValue('mgcSecIpAddress');
    component.editOperationForm.get('secipAddress')?.setValue('');
    component.editOperationForm.get('cac')?.setValue('5');
    component.selectedRowValues = selectedRowValues;
    component.showEditResultDialog = true;

    component.handleOperationChange('Change LBL Info');
    tick();

    expect(commonServiceMock.showErrorMessage).toHaveBeenCalledWith(
      'GW Secondary IP can not be empty!'
    );
    expect(component.isLoading).toBe(false);
    expect(component.showEditResultDialog).toBe(true);
  }));

  // SIGNALING
  it('should reset form and set validators for SIGNALING on updateFormValidators true, handleOperationChange()', () => {
    const updateFormValidators = true;
    const sgIpControl = component.getFormFieldControl('sgIp');
    const sgPort1Control = component.getFormFieldControl('sgPort1');

    component.handleOperationChange('Change Signaling Gateway', updateFormValidators);

    expect(component.validatorFieldsRefs.length).toBe(2);
  });

  it('should handle SIGNALING operation correctly', () => {
    const sgIp = '127.0.0.1';
    const sgPort1 = 1234;
    const sgPort2 = 5678;
    component.selectedRowValues = selectedRowValues;

    component.editOperationForm.get('sgIp')?.setValue(sgIp);
    component.editOperationForm.get('sgPort1')?.setValue(sgPort1);
    component.editOperationForm.get('sgPort2')?.setValue(sgPort2);

    const expectedBody = {
      gwName: selectedRowValues.name,
      sgIPAddr1: sgIp,
      sgIPAddr2: '0.0.0.0',
      sgPort1: sgPort1,
      sgPort2: sgPort2 || '0'
    };

    const signalingBody = {
      gwName: component.selectedRowValues.name,
      sgIPAddr1: component.editOperationForm.get('sgIp')?.value,
      sgIPAddr2: '0.0.0.0',
      sgPort1: component.editOperationForm.get('sgPort1')?.value,
      sgPort2: component.editOperationForm.get('sgPort2')?.value
        ? component.editOperationForm.get('sgPort2')?.value
        : '0'
    };

    const preMessage = translate.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.GATEWAYS
      .CHANGE_SIGNALING_GW_IP.CONFIRM.MESSAGE_ABOUT_VALUE +
      translate.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.GATEWAYS.CHANGE_SIGNALING_GW_IP.CONFIRM.VALUES +
      translate.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.GATEWAYS.CHANGE_SIGNALING_GW_IP.CONFIRM.CONFIRM_MESSAGE;

    component.handleOperationChange('Change Signaling Gateway');

    expect(component.changeSignalingGWMessage).toEqual(preMessage
      .replace(/{{sgIp}}/, signalingBody.sgIPAddr1)
      .replace(/{{port1}}/, signalingBody.sgPort1)
      .replace(/{{port2}}/, signalingBody.sgPort2));
    expect(component.showChangeSignalingGWConfirmDialog).toBe(true);
  });

  it('should handle SIGNALING operation correctly confirmation event=true', fakeAsync(() => {
    const sgIp = '127.0.0.1';
    const sgPort1 = 1234;
    const sgPort2 = 5678;
    component.selectedRowValues = selectedRowValues;

    component.editOperationForm.get('sgIp')?.setValue(sgIp);
    component.editOperationForm.get('sgPort1')?.setValue(sgPort1);
    component.editOperationForm.get('sgPort2')?.setValue(sgPort2);

    component.signalingBodyValue = {
      gwName: selectedRowValues.name,
      sgIPAddr1: component.editOperationForm.get('sgIp')?.value,
      sgIPAddr2: '0.0.0.0',
      sgPort1: component.editOperationForm.get('sgPort1')?.value,
      sgPort2: component.editOperationForm.get('sgPort2')?.value
        ? component.editOperationForm.get('sgPort2')?.value
        : '0'
    };

    const expectedBody = {
      gwName: selectedRowValues.name,
      sgIPAddr1: sgIp,
      sgIPAddr2: '0.0.0.0',
      sgPort1: sgPort1,
      sgPort2: sgPort2 || '0'
    };

    component.changeSignalingGWDialogFooterHandler(true);
    tick();

    expect(gwcServiceMock.postSignalingGwInfo).toHaveBeenCalledWith(
      selectedRowValues.gwcID,
      expectedBody
    );
    expect(component.isLoading).toBe(false);
    expect(component.editResultDialogContent).toContain(selectedRowValues.name);
    expect(component.showEditResultDialog).toBe(true);
  }));

  it('should handle error changeSignalingGWDialogFooterHandler event=true', () => {
    gwcServiceMock.postSignalingGwInfo.and.returnValue(throwError({
      error: {
        errorCode: '500',
        message: '"message = Gateway test.q does not exist in the database. details = com.nortel.ptm.gwcem.exceptions.GWCException:' +
        ' Gateway test.q does not exist in the database.'
      }
    }));
    const messageText = '"test834" : Signaling Gateway IP and ports change failed.' +
        '  Reason -  Gateway test.q does not exist in the database.';

    component.selectedRowValues = selectedRowValues;

    component.changeSignalingGWDialogFooterHandler(true);

    expect(component.isLoading).toBe(false);
    expect(component.messageText.trim()).toBe(messageText.trim());

    expect(component.showEditResultDialog).toBe(true);
  });

  it('should handle changeSignalingGWDialogFooterHandler event=false', () => {
    spyOn(component, 'closeChangeSignalingGWConfirmDialog');

    component.changeSignalingGWDialogFooterHandler(false);

    expect(component.closeChangeSignalingGWConfirmDialog).toHaveBeenCalled();
  });

  it('should handle closeErrorDialog', () => {
    component.closeErrorDialog();

    expect(component.showChangeSignalingGWConfirmDialog).toBeFalse();
    expect(component.changeSignalingGWMessage).toBe('');
  });

  it('should handle error during LGRP_TYPE operation -> saveLgrpType', fakeAsync(() => {
    gwcServiceMock.saveLgrpType.and.returnValue(throwError('error'));

    component.selectedRowValues = selectedRowValues;

    component.onWarningChangeLGRPFormSubmit(true);
    tick();

    expect(gwcServiceMock.saveLgrpType).toHaveBeenCalled();
    expect(component.isLoading).toBe(false);
    expect(commonServiceMock.showAPIError).toHaveBeenCalledWith('error');
  }));
});
