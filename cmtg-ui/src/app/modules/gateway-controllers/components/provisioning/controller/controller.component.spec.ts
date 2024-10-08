import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { ControllerComponent } from './controller.component';
import { GatewayControllersService } from '../../../services/gateway-controllers.service';
import { CommonService } from 'src/app/services/common.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateInternalService } from 'src/app/services/translate-internal.service';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AuthenticationService } from 'src/app/auth/services/authentication.service';
import { AppModule } from 'src/app/app.module';
import { OverlayPanel } from 'primeng/overlaypanel';
import { GWCNodeResponse } from '../../../models/gwControllers';
import { NetworkViewService } from 'src/app/services/api/network-view.service';

describe('ControllerComponent', () => {
  let component: ControllerComponent;
  let fixture: ComponentFixture<ControllerComponent>;
  let formBuilder: FormBuilder;
  const translate = {
    translateResults: {
      COMMON: {
        EDIT: 'Edit'
      },
      GATEWAY_CONTROLLERS: {
        TITLE: 'Gateway Controllers',
        OVERLAY_BUTTONS: {
          DISASSOCIATE_GW: 'Disassociate Media Gateway',
          DELETE_GWC_NODE: 'Delete GWC Node'
        },
        MAINTENANCE: {
          TITLE: 'Maintenance',
          ACTIVE_UNIT: 'Active Unit',
          OVERALL_STATUS: 'Overall Status'
        },
        PROVISIONING: {
          TITLE: 'Provisioning',
          TABS: {
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
                  POST_CONFIGURE_SUCCESS: 'Network codec profile changed succesfully',
                  MTC_CONTROL_SUCCESS: 'Auto swact timer changed successfully',
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
              },
              EDIT_MSG: {
                RC_0: 'RC_0 Message',
                RC_56: 'RC_56 Message',
                RC_57: 'RC_57 Message',
                RC_58: 'RC_58 Message',
                RC_59: 'RC_59 Message',
                RC_UNKNOWN: 'RC_UNKNOWN Message'
              },
              ERROR: {
                'EMPTY_GWC_ADDRESS': 'The value of GWC address name should not be null!'
              }
            },
            GATEWAYS: {
              TITLE: 'Gateways',
              TABLE: {
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
              }
            },
            LINES: {
              TITLE: 'Lines'
            },
            CARRIERS: {
              TITLE: 'Carriers'
            },
            QOS_COLLECTORS: {
              TITLE: 'QoS Collectors'
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

  const authServiceMock = jasmine.createSpyObj('authService', ['getCLLI']);

  const nvServiceMock = jasmine.createSpyObj('nv', [
    'getGatewayControllerProfileData'
  ]);

  const commonServiceMock = jasmine.createSpyObj('commonService', [
    'showAPIError',
    'showErrorMessage',
    'showSuccessMessage'
  ]);

  const gwcServiceMock = jasmine.createSpyObj('gwcService', [
    'getGWEStatistics',
    'getGWCNodeByName_v1',
    'getGWCNodesByFilter_v1',
    'getGWCMtcControlData',
    'getQueryNtwkCodecProfilesByFilter_v1',
    'postGWCMtcControlData',
    'postConfigureGWCService',
    'getFlowthroughStatus',
    'getProfiles',
    'postGWCMtcControlData',
    'postConfigureGWCService',
    'postControllerProfileCallAgentPanelSave'
  ]);

  const nvRes = {
    identifier: 'TRUNKNA_V2',
    types: [
      {
        __value: 2
      },
      {
        __value: 8
      },
      {
        __value: 15
      }
    ],
    capacity: [8188, 24, 0],
    toneinfo: 'NORTHAM',
    execinfo: [
      {
        name: 'UTR250',
        termtype: 'PRAB'
      },
      {
        name: 'GWCEX',
        termtype: 'ABTRK'
      },
      {
        name: 'GWC250',
        termtype: 'AB250'
      },
      {
        name: 'GWCFX',
        termtype: 'AB250'
      },
      {
        name: 'DTCEX',
        termtype: 'PRAB'
      }
    ],
    compatibleProfiles: ['TRUNKNA_V2']
  };
  const clliResponse = 'CO39';
  const getFlowthroughStatusTrue = true;
  const getGWEStatisticsResponse = {
    count: 1,
    gwcStatisticsList: [
      {
        gwcStatName: 'Total Reserved Endpoints',
        gwcStatValue: '144'
      }
    ]
  };
  const getGWCNodeByNameResponse = {
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
        }
      ],
      bearerNetworkInstance: 'NET 2',
      bearerFabricType: 'IP',
      codecProfileName: 'default',
      execDataList: [
        {
          name: 'DPLEX',
          termtype: 'DPL_TERM'
        }
      ],
      defaultGwDomainName: ''
    },
    deviceList: []
  };
  const getGWCNodesByFilterResponse: GWCNodeResponse = {
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
            }
          ],
          bearerNetworkInstance: 'NET 2',
          bearerFabricType: 'IP',
          codecProfileName: 'default',
          execDataList: [
            {
              name: 'DPLEX',
              termtype: 'DPL_TERM'
            }
          ],
          defaultGwDomainName: ''
        },
        deviceList: []
      }
    ]
  };
  const getGWCMtcControlDataResponseElse = {
    gwcID: 'GWC-0',
    autoSwactTimer: 70
  };
  const getGWCMtcControlDataResponseIf = { gwcID: 'GWC-0', autoSwactTimer: -1 };
  const getProfilesResponse = ['LINE_TRUNK_AUD_NA'];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ControllerComponent],
      providers: [
        { provide: GatewayControllersService, useValue: gwcServiceMock },
        { provide: NetworkViewService, useValue: nvServiceMock },
        { provide: CommonService, useValue: commonServiceMock },
        { provide: TranslateInternalService, useValue: translate },
        { provide: AuthenticationService, useValue: authServiceMock },
        FormBuilder
      ],
      imports: [AppModule, TranslateModule.forRoot()],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ControllerComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);
    component.controllerForm = formBuilder.group({
      gwcAuto: false,
      preSwact: ''
    });
    component.profileForm = formBuilder.group({
      gwcAddresName: '',
      flow: false,
      profiles: { label: '', value: '' }
    });
    gwcServiceMock.getQueryNtwkCodecProfilesByFilter_v1.and.returnValue(
      of({
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
      })
    );
    gwcServiceMock.getGWEStatistics.and.returnValue(
      of(getGWEStatisticsResponse)
    );
    gwcServiceMock.getGWCNodeByName_v1.and.returnValue(
      of(getGWCNodeByNameResponse)
    );
    gwcServiceMock.getGWCNodesByFilter_v1.and.returnValue(
      of(getGWCNodesByFilterResponse)
    );
    gwcServiceMock.getGWCMtcControlData.and.returnValue(
      of(getGWCMtcControlDataResponseElse)
    );
    gwcServiceMock.getProfiles.and.returnValue(of(getProfilesResponse));
    gwcServiceMock.getFlowthroughStatus.and.returnValue(
      of(getFlowthroughStatusTrue)
    );
    authServiceMock.getCLLI.and.returnValue(of(clliResponse));
    nvServiceMock.getGatewayControllerProfileData.and.returnValue(of(nvRes));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle error', () => {
    gwcServiceMock.getQueryNtwkCodecProfilesByFilter_v1.and.returnValue(
      throwError('error')
    );

    component.initCodecProfileOptions();
    expect(
      gwcServiceMock.getQueryNtwkCodecProfilesByFilter_v1
    ).toHaveBeenCalled();
    expect(commonServiceMock.showAPIError).toHaveBeenCalledWith('error');
  });

  it('should call hide method on element when closeOverlayPanel is invoked', () => {
    const mockEvent = {} as any;
    const mockElement: Partial<OverlayPanel> = {
      hide: jasmine.createSpy('hide')
    };

    component.closeOverlayPanel(mockEvent, mockElement as OverlayPanel);

    expect(mockElement.hide).toHaveBeenCalledWith(mockEvent);
  });

  it('should subscribe to value changes gwcAuto === true on ngOnInit', () => {
    const gwcAutoValue = true;
    component.controllerForm.get('gwcAuto')?.setValue(gwcAutoValue);

    component.ngOnInit();

    expect(component.controllerForm.controls['gwcAuto'].value).toEqual(
      gwcAutoValue
    );
    expect(component.controllerForm.controls['preSwact'].value).toEqual(180);
    expect(component.isDisabled).toEqual(gwcAutoValue);
    expect(component.toggleStatus).toBe('Enabled');
  });

  it('should subscribe to value changes gwcAuto === false on ngOnInit', () => {
    const gwcAutoValue = false;
    component.controllerForm.get('gwcAuto')?.setValue(gwcAutoValue);

    component.ngOnInit();

    expect(component.controllerForm.controls['gwcAuto'].value).toEqual(
      gwcAutoValue
    );
    expect(component.controllerForm.controls['preSwact'].value).toEqual(null);
    expect(component.toggleStatus).toBe('Disabled');
  });

  it('should subscribe to value changes profiles if getFlowthroughStatus res === true on ngOnInit', () => {
    const selectedProfile = 'SMALL_LINENA_V2';

    component.profileForm.get('profiles')?.setValue(selectedProfile);
    component.ngOnInit();

    expect(component.profileForm.controls['profiles'].value).toBe(
      selectedProfile
    );
    expect(component.profileForm.controls['flow']?.value).toBeFalse();
  });

  it('should subscribe to value changes profiles if getFlowthroughStatus res === false on ngOnInit', () => {
    const selectedProfile = 'SMALL_LINENA_V2';
    const getFlowthroughStatusFalse = false;
    gwcServiceMock.getFlowthroughStatus.and.returnValue(
      of(getFlowthroughStatusFalse)
    );
    component.profileForm.get('profiles')?.setValue(selectedProfile);

    component.ngOnInit();

    expect(component.profileForm.controls['profiles'].value).toBe(
      selectedProfile
    );
    expect(component.profileForm.controls['flow'].value).toBeFalse();
  });

  it('should subscribe to value changes flow if isChecked === true on ngOnInit', () => {
    const isChecked = true;
    component.profileForm.get('flow')?.setValue(isChecked);

    component.ngOnInit();

    expect(component.profileForm.controls['flow'].value).toBe(isChecked);
    expect(component.currentFlowThruValue).toEqual(isChecked);
  });

  it('should subscribe to value changes flow if isChecked === false on ngOnInit', () => {
    const isChecked = false;
    component.profileForm.get('flow')?.setValue(isChecked);

    component.ngOnInit();

    expect(component.profileForm.controls['flow'].value).toBe(isChecked);
    expect(component.profileForm.controls['gwcAddresName'].disabled).toBeTrue();
    expect(component.currentFlowThruValue).toEqual(isChecked);
  });

  it('should call ngOnChanges() with subscribe getGWCNodeByName_v1 if res is true', () => {
    const gwcControllerName = 'GWC-0';
    const defaultGwDomainName = '<None>';
    spyOn(component, 'initProfileOptions');
    spyOn(component, 'getProfileTableData');
    spyOn(component, 'getCallAgentTableData');

    component.gwControllerName = 'GWC-0';
    component.defaultGwDomainName = '';
    component.ngOnChanges();

    expect(component.initProfileOptions).toHaveBeenCalledWith(
      gwcControllerName
    );
    expect(component.getProfileTableData).toHaveBeenCalledWith(
      gwcControllerName
    );
    expect(component.getCallAgentTableData).toHaveBeenCalledWith(
      gwcControllerName
    );
    expect(component.currentGwControllerName).toEqual(gwcControllerName);
    expect(gwcServiceMock.getGWCNodeByName_v1).toHaveBeenCalledWith(
      gwcControllerName
    );
    expect(component.defaultGwDomainName).toBe(defaultGwDomainName);
  });

  it('should initialize profile options with default value', () => {
    const gwc = 'GWC-0';
    const profilesResponse = ['profile1', 'profile2'];

    gwcServiceMock.getProfiles.and.returnValue(of(profilesResponse));

    component.profileForm = new FormGroup({
      profiles: new FormControl({
        label: 'LINE_TRUNK_AUD_NA',
        value: 'LINE_TRUNK_AUD_NA'
      })
    });

    component.initProfileOptions(gwc);

    expect(gwcServiceMock.getProfiles).toHaveBeenCalledWith(gwc);
    expect(component.isLoading).toBeFalse();
    expect(component.profilesOptions).toEqual([
      { label: 'profile1', value: 'profile1' },
      { label: 'profile2', value: 'profile2' }
    ]);
    expect(gwcServiceMock.getGWCNodeByName_v1).toHaveBeenCalledWith(
      component.currentGwControllerName
    );
    expect(component.isLoading).toBeFalse();
    expect(component.profileForm.get('profiles')?.value).toEqual({
      label: 'LINE_TRUNK_AUD_NA',
      value: 'LINE_TRUNK_AUD_NA'
    });
  });

  it('should handle error and call showErrorMessage getGWCNodeByName_v1', () => {
    const errorMessage = 'Error fetching node information';

    gwcServiceMock.getGWCNodeByName_v1.and.returnValue(
      throwError(errorMessage)
    );

    component.ngOnChanges();

    expect(gwcServiceMock.getGWCNodeByName_v1).toHaveBeenCalledWith(
      component.currentGwControllerName
    );
    expect(commonServiceMock.showAPIError).toHaveBeenCalledWith(
      errorMessage
    );
  });

  it('getGWCMtcControlData if', () => {
    gwcServiceMock.getGWCMtcControlData.and.returnValue(
      of(getGWCMtcControlDataResponseIf)
    );
    const gwControllerName = 'GWC-0';

    component.gwControllerName = 'GWC-0';
    component.ngOnChanges();

    expect(gwcServiceMock.getGWCMtcControlData).toHaveBeenCalledWith(
      gwControllerName
    );
    expect(component.gwcAuto).toBe(false);
    expect(component.resetPreSwactValue).toBe(null);
  });

  it('getGWCMtcControlData handle error', () => {
    gwcServiceMock.getGWCMtcControlData.and.returnValue(throwError('error'));
    const gwControllerName = 'GWC-0';

    component.gwControllerName = 'GWC-0';
    component.ngOnChanges();

    expect(gwcServiceMock.getGWCMtcControlData).toHaveBeenCalledWith(
      gwControllerName
    );
    expect(component.isLoading).toBe(false);
    expect(commonServiceMock.showAPIError).toHaveBeenCalledWith('error');
  });

  it('ngOnChanges getGWEStatistics handle error', () => {
    gwcServiceMock.getGWEStatistics.and.returnValue(throwError('error'));
    const gwControllerName = 'GWC-0';

    component.gwControllerName = 'GWC-0';
    component.ngOnChanges();

    expect(gwcServiceMock.getGWEStatistics).toHaveBeenCalledWith(
      gwControllerName
    );
    expect(component.isLoading).toBe(false);
    expect(commonServiceMock.showAPIError).toHaveBeenCalledWith('error');
  });

  it('should call getCallAgentTableData', () => {
    const gwc = 'GWC-0';

    component.agentTableData = [];
    component.getCallAgentTableData(gwc);

    expect(gwcServiceMock.getGWCNodesByFilter_v1).toHaveBeenCalledWith(gwc);
    expect(component.isLoading).toBe(false);
    expect(component.agentTableData).toEqual(
      getGWCNodesByFilterResponse.nodeList[0].serviceConfiguration.execDataList
    );
  });

  it('should call getProfileTableData with currentGwControllerName on refreshProfileTable', () => {
    const currentGwControllerName = 'GWC-0';
    spyOn(component, 'getProfileTableData');

    component.currentGwControllerName = currentGwControllerName;
    component.refreshProfileTable();

    expect(component.getProfileTableData).toHaveBeenCalledWith(
      currentGwControllerName
    );
  });

  it('should call getCallAgentTableData with currentGwControllerName on refreshCallAgentTable', () => {
    const currentGwControllerName = 'GWC-0';
    spyOn(component, 'getCallAgentTableData');

    component.currentGwControllerName = currentGwControllerName;
    component.refreshCallAgentTable();

    expect(component.getCallAgentTableData).toHaveBeenCalledWith(
      currentGwControllerName
    );
  });

  it('should submit Controller form and handle save (event === true)', () => {
    const event = true;
    component.currentGwControllerName = 'GWC-0';
    component.controllerForm.get('preSwact')?.setValue('180');
    component.codecProfileName = 'default';
    const tempData = {
      gwcID: component.currentGwControllerName,
      autoSwactTimer: component.controllerForm.get('preSwact')?.value
    };
    gwcServiceMock.postGWCMtcControlData.and.returnValue(of(null));
    gwcServiceMock.postConfigureGWCService.and.returnValue(of(null));

    component.onControllerFormSubmit(event);

    expect(gwcServiceMock.postGWCMtcControlData).toHaveBeenCalledWith(tempData);
    expect(component.isLoading).toBeFalse();
  });

  it('should submit Controller form and handle reset (event === false)', () => {
    const event = false;
    spyOn(component, 'ngOnChanges');

    component.onControllerFormSubmit(event);

    expect(component.ngOnChanges).toHaveBeenCalled();
  });

  it('should give empty input error on submit Profile form and handle save (event === true) currentFlowThruValue === true ', () => {
    const event = true;
    component.profileForm.get('gwcAddresName')?.setValue('');
    component.currentFlowThruValue = true;
    component.currentGwControllerName = 'GWC-0';
    const [gwc, gwcId] = component.currentGwControllerName.split('-');

    component.onProfileFormSubmit(event);
    expect(commonServiceMock.showErrorMessage).toHaveBeenCalledWith(
      translate.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS
        .CONTROLLER.ERROR.EMPTY_GWC_ADDRESS
    );
  });

  it('should submit Profile form and handle save (event === true) currentFlowThruValue === true', () => {
    const event = true;
    component.profileForm.get('gwcAddresName')?.setValue('GWC-3');
    component.currentFlowThruValue = true;
    component.currentGwControllerName = 'GWC-0';
    component.clli = 'CO39';
    const [gwc, gwcId] = component.currentGwControllerName.split('-');
    const body = [
      {
        field_name: 'profile_name',
        value: component.selectedProfileName
      },
      {
        field_name: 'gwc_name_flowThr',
        value: component.currentGwControllerName
      },
      {
        field_name: 'active_ip_flowThr',
        value: component.activeIp
      },
      {
        field_name: 'gwc_addressName_flowThr',
        value: component.profileForm.get('gwcAddresName')?.value
      }
    ];

    gwcServiceMock.postControllerProfileCallAgentPanelSave.and.returnValue(
      of(null)
    );

    component.onProfileFormSubmit(event);

    expect(
      gwcServiceMock.postControllerProfileCallAgentPanelSave
    ).toHaveBeenCalledWith(Number(gwcId), component.clli, body);
  });

  it('should populate execLineOptions correctly', () => {
    const profileName = component.profileForm.get('profiles')?.value;
    const expectedExecLineOptions = [{ label: 'exec1', value: 'exec1' }];
    component.execLineOptions = expectedExecLineOptions;

    component.editHandle();

    expect(component.showActionDialog).toBeTrue();
    expect(nvServiceMock.getGatewayControllerProfileData).toHaveBeenCalledWith(
      profileName
    );
    expect(component.execLineOptions).toBeDefined();
  });

  it('should generate post body correctly', () => {
    const termTypeToFilter = 'termtype1';
    const newName = 'newName';
    const agentTableData = [
      { name: 'name1', termtype: 'termtype1' },
      { name: 'name2', termtype: 'termtype2' },
      { name: 'name3', termtype: 'termtype1' }
    ];
    component.agentTableData = agentTableData;

    const postBody = component.generatePostBody(termTypeToFilter, newName);

    const expectedPostBody = [
      { field_name: 'execdata', value: `${newName},${termTypeToFilter}` },
      { field_name: 'execdata', value: `${agentTableData[1].name},${agentTableData[1].termtype}` },
      { field_name: 'execdata', value: `${newName},${termTypeToFilter}` }
    ];

    expect(postBody.length).toEqual(3);
    expect(postBody).toEqual(expectedPostBody);
  });

  it('initProfileOptions getProfiles handle error', () => {
    gwcServiceMock.getProfiles.and.returnValue(throwError('error'));
    const gwControllerName = 'GWC-0';

    component.gwControllerName = 'GWC-0';
    component.initProfileOptions(gwControllerName);

    expect(gwcServiceMock.getProfiles).toHaveBeenCalledWith(
      gwControllerName
    );
    expect(component.isLoading).toBe(false);
    expect(commonServiceMock.showAPIError).toHaveBeenCalledWith('error');
  });

  it('getCallAgentTableData getGWCNodesByFilter_v1 handle error', () => {
    gwcServiceMock.getGWCNodesByFilter_v1.and.returnValue(throwError('error'));
    const gwControllerName = 'GWC-0';

    component.gwControllerName = 'GWC-0';
    component.getCallAgentTableData(gwControllerName);

    expect(gwcServiceMock.getGWCNodesByFilter_v1).toHaveBeenCalledWith(
      gwControllerName
    );
    expect(component.isLoading).toBe(false);
    expect(commonServiceMock.showAPIError).toHaveBeenCalledWith('error');
  });

  it('should handle closeDialog()', () => {
    component.showActionDialog = false;
    spyOn(component.actionForm, 'reset').and.callThrough();

    component.closeDialog();

    expect(component.actionForm.reset).toHaveBeenCalled();
    expect(component.showActionDialog).toBeFalse();
  });

  it('should handle table action submission for true case', () => {
    spyOn(component, 'refreshCallAgentTable');
    component.currentGwControllerName = 'GWC-0';
    const mockResponse = { rc: { __value: 0 } };
    gwcServiceMock.postControllerProfileCallAgentPanelSave.and.returnValue(of(mockResponse));

    component.onTableActionSubmit(true);

    expect(gwcServiceMock.postControllerProfileCallAgentPanelSave).toHaveBeenCalledWith(0, 'CO39', []);
    expect(commonServiceMock.showSuccessMessage).toHaveBeenCalledWith('RC_0 Message');
    expect(component.showActionDialog).toBeFalse();
    expect(component.refreshCallAgentTable).toHaveBeenCalled();
  });

  it('should handle table action submission for true case', () => {
    spyOn(component, 'refreshCallAgentTable');
    component.currentGwControllerName = 'GWC-0';
    const mockResponse = { rc: { __value: 56 } };
    gwcServiceMock.postControllerProfileCallAgentPanelSave.and.returnValue(of(mockResponse));

    component.onTableActionSubmit(true);

    expect(gwcServiceMock.postControllerProfileCallAgentPanelSave).toHaveBeenCalledWith(0, 'CO39', []);
    expect(commonServiceMock.showErrorMessage).toHaveBeenCalledWith(translate.translateResults
      .GATEWAY_CONTROLLERS.PROVISIONING.TABS.CONTROLLER.EDIT_MSG.RC_56);
    expect(component.showActionDialog).toBeFalse();
    expect(component.refreshCallAgentTable).toHaveBeenCalled();
  });

  it('should handle table action submission for true case', () => {
    spyOn(component, 'refreshCallAgentTable');
    component.currentGwControllerName = 'GWC-0';
    const mockResponse = { rc: { __value: 57 } };
    gwcServiceMock.postControllerProfileCallAgentPanelSave.and.returnValue(of(mockResponse));

    component.onTableActionSubmit(true);

    expect(gwcServiceMock.postControllerProfileCallAgentPanelSave).toHaveBeenCalledWith(0, 'CO39', []);
    expect(commonServiceMock.showErrorMessage).toHaveBeenCalledWith(translate.translateResults
      .GATEWAY_CONTROLLERS.PROVISIONING.TABS.CONTROLLER.EDIT_MSG.RC_57);
    expect(component.showActionDialog).toBeFalse();
    expect(component.refreshCallAgentTable).toHaveBeenCalled();
  });

  it('should handle table action submission for true case', () => {
    spyOn(component, 'refreshCallAgentTable');
    component.currentGwControllerName = 'GWC-0';
    const mockResponse = { rc: { __value: 58 } };
    gwcServiceMock.postControllerProfileCallAgentPanelSave.and.returnValue(of(mockResponse));

    component.onTableActionSubmit(true);

    expect(gwcServiceMock.postControllerProfileCallAgentPanelSave).toHaveBeenCalledWith(0, 'CO39', []);
    expect(commonServiceMock.showErrorMessage).toHaveBeenCalledWith(translate.translateResults
      .GATEWAY_CONTROLLERS.PROVISIONING.TABS.CONTROLLER.EDIT_MSG.RC_58);
    expect(component.showActionDialog).toBeFalse();
    expect(component.refreshCallAgentTable).toHaveBeenCalled();
  });

  it('should handle table action submission for true case', () => {
    spyOn(component, 'refreshCallAgentTable');
    component.currentGwControllerName = 'GWC-0';
    const mockResponse = { rc: { __value: 59 } };
    gwcServiceMock.postControllerProfileCallAgentPanelSave.and.returnValue(of(mockResponse));

    component.onTableActionSubmit(true);

    expect(gwcServiceMock.postControllerProfileCallAgentPanelSave).toHaveBeenCalledWith(0, 'CO39', []);
    expect(commonServiceMock.showErrorMessage).toHaveBeenCalledWith(translate.translateResults
      .GATEWAY_CONTROLLERS.PROVISIONING.TABS.CONTROLLER.EDIT_MSG.RC_59);
    expect(component.showActionDialog).toBeFalse();
    expect(component.refreshCallAgentTable).toHaveBeenCalled();
  });

  it('should handle table action submission for true case', () => {
    spyOn(component, 'refreshCallAgentTable');
    component.currentGwControllerName = 'GWC-0';
    const mockResponse = { rc: { __value: 60 } };
    gwcServiceMock.postControllerProfileCallAgentPanelSave.and.returnValue(of(mockResponse));

    component.onTableActionSubmit(true);

    expect(gwcServiceMock.postControllerProfileCallAgentPanelSave).toHaveBeenCalledWith(0, 'CO39', []);
    expect(commonServiceMock.showErrorMessage).toHaveBeenCalledWith(translate.translateResults
      .GATEWAY_CONTROLLERS.PROVISIONING.TABS.CONTROLLER.EDIT_MSG.RC_UNKNOWN);
    expect(component.showActionDialog).toBeFalse();
    expect(component.refreshCallAgentTable).toHaveBeenCalled();
  });

  it('should handle table action submission for false case', () => {
    spyOn(component, 'closeDialog');

    component.onTableActionSubmit(false);

    expect(component.closeDialog).toHaveBeenCalled();
  });

  it('should handle closeErrorDialog()', () => {
    component.messageText = '';
    component.detailsText = '';
    component.showErrorDialog = false;
    component.showDetailsBtn = true;

    component.closeErrorDialog();

    expect(component.messageText).toBe('');
    expect(component.detailsText).toBe('');
    expect(component.showErrorDialog).toBeFalse();
    expect(component.showDetailsBtn).toBeTrue();
  });

  it('should toggle showDetailsBtn property', () => {
    component.showOrHideButtonClick();
    expect(component.showDetailsBtn).toBeFalse();
    component.showOrHideButtonClick();
    expect(component.showDetailsBtn).toBeTrue();
  });

  it('should submit Profile form and handle save (event === false)', () => {
    const event = false;
    spyOn(component, 'refreshCallAgentTable');
    spyOn(component, 'refreshProfileTable');
    spyOn(component.profileForm, 'reset').and.callThrough();
    component.currentGwControllerName = 'GWC-0';
    component.clli = 'CO39';

    component.onProfileFormSubmit(event);

    expect(component.profileForm.reset).toHaveBeenCalled();
    expect(component.refreshCallAgentTable).toHaveBeenCalled();
    expect(component.refreshProfileTable).toHaveBeenCalled();
  });

  it('should submit Profile form and handle save (event === true) currentFlowThruValue === false', () => {
    const event = true;
    component.currentFlowThruValue = false;
    component.currentGwControllerName = 'GWC-0';
    component.clli = 'CO39';
    const [gwc, gwcId] = component.currentGwControllerName.split('-');
    const body = [
      {
        field_name: 'profile_name',
        value: component.selectedProfileName
      },
      {
        field_name: 'gwc_name_flowThr',
        value: component.currentGwControllerName
      },
      {
        field_name: 'active_ip_flowThr',
        value: component.activeIp
      },
      {
        field_name: 'gwc_addressName_flowThr',
        value: component.profileForm.get('gwcAddresName')?.value
      }
    ];

    gwcServiceMock.postControllerProfileCallAgentPanelSave.and.returnValue(
      of('success')
    );

    component.onProfileFormSubmit(event);

    expect(
      gwcServiceMock.postControllerProfileCallAgentPanelSave
    ).toHaveBeenCalled();
  });

  it('should submit Profile form and handle error currentFlowThruValue === false', () => {
    gwcServiceMock.postControllerProfileCallAgentPanelSave.and.returnValue(throwError('error'));
    const event = true;
    component.currentFlowThruValue = false;
    component.currentGwControllerName = 'GWC-0';
    component.clli = 'CO39';
    const [gwc, gwcId] = component.currentGwControllerName.split('-');
    const body = [
      {
        field_name: 'profile_name',
        value: component.selectedProfileName
      },
      {
        field_name: 'gwc_name_flowThr',
        value: component.currentGwControllerName
      },
      {
        field_name: 'active_ip_flowThr',
        value: component.activeIp
      },
      {
        field_name: 'gwc_addressName_flowThr',
        value: component.profileForm.get('gwcAddresName')?.value
      }
    ];
    component.onProfileFormSubmit(event);

    expect(component.isLoading).toBe(false);
    expect(commonServiceMock.showAPIError).toHaveBeenCalledWith('error');
  });

  it('should submit Profile form and handle error currentFlowThruValue === true', () => {
    gwcServiceMock.postControllerProfileCallAgentPanelSave.and.returnValue(throwError('error'));
    const event = true;
    component.currentFlowThruValue = true;
    component.currentGwControllerName = 'GWC-0';
    component.clli = 'CO39';
    const [gwc, gwcId] = component.currentGwControllerName.split('-');
    const body = [
      {
        field_name: 'profile_name',
        value: component.selectedProfileName
      },
      {
        field_name: 'gwc_name_flowThr',
        value: component.currentGwControllerName
      },
      {
        field_name: 'active_ip_flowThr',
        value: component.activeIp
      },
      {
        field_name: 'gwc_addressName_flowThr',
        value: component.profileForm.get('gwcAddresName')?.value
      }
    ];
    component.profileForm.get('gwcAddresName')?.setValue('addresName');
    component.onProfileFormSubmit(event);

    expect(commonServiceMock.showAPIError).toHaveBeenCalledWith('error');
  });
});
