import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GatewayInformationComponent } from './gateway-information.component';
import { AppModule } from 'src/app/app.module';
import { TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { TranslateInternalService } from 'src/app/services/translate-internal.service';
import { GatewayControllersService } from '../../../services/gateway-controllers.service';
import { NetworkViewService } from 'src/app/services/api/network-view.service';
import { AssociateFormService } from '../../../services/associate-form.service';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

describe('GatewayInformationComponent', () => {
  let component: GatewayInformationComponent;
  let fixture: ComponentFixture<GatewayInformationComponent>;
  let fb: FormBuilder;
  const translate = {
    translateResults: {
      GATEWAY_CONTROLLERS: {
        ASSOCIATE_MEDIA_GW: {
          LABEL: {
            ASSOCIATE_MEDIA_GATEWAY: 'Associate Media Gateway',
            ASSOCIATE: 'Associate',
            GWC_BACKUP: 'GWC Backup Path for Emergency Calls',
            ASSOCIATE_MG: 'Associate MG',
            AUDIT_DETAIL:
              'A data audit is in progress, no requests allowed, please wait until it completes',
            FAILED_TO_ASSOCIATE: 'Failed to associate MG to a GWC',
            PLEASE_WAIT: 'Please wait while process...',
            GWIP_ERROR:
              'The IP address for this type of',
            CONFIRM_DIALOG: 'Confirm',
            CONFIRMATION_DIALOG_CONTENT:
              'Current {{gwcName}}{{unit}} load version is lower ',
            CAC_CONFIRM_TITLE: 'Associate MG with Backup Path',
            ASSOCIATE_MG_TO_GWC: 'Successfully associated MG to a GWC!',
            ERROR: 'Failed to Associate'
          },
          GWC_ERROR_MSG: {
            MGC_SECIP_INVALID:
              'MGC Secondary IP Address cannot be specified as 0.0.0.0 or 255.255.255.255 Associate MG with Backup Path',
            GW_SECIP_EMPTY:
              'Gateway cannot be added with backup path because GW Secondary IP Address is not specified. Associate MG with Backup Path',
            GW_SECIP_INVALID:
              'Gateway Secondary IP Address cannot be specified as 0.0.0.0 or 255.255.255.255 Associate MG with Backup Path',
            CAC_ZERO:
              'Caution: Zero CAC value '
          },
          FIELDS: {
            GATEWAY_INFO: {
              TITLE: 'Gateway Information',
              NAME: 'Name',
              IP_ADDRESS: 'IP Address',
              CONTROLLER_NAME: 'Controller Name',
              PROFILE_NAME: 'Profile Name',
              RESERVED_TERMINATIONS: 'Reserved Terminations',
              SITE_NAME: 'Site Name',
              LGRP_TYPE: 'LGRP Type',
              NODE_SHARING: 'Node Sharing',
              AUTO_SELECT: '<auto-select>',
              GATEWAY_PEP_SERVER: 'Gateway PEP server',
              GATEWAY_ALG: 'Gateway ALG',
              TOOLTIP: {
                GATEWAY_NAME:
                  'Line Gateway names typically have a \'.\' as part of name',
                IP_ADDRESS: 'Valid values:<0-255>.<0-255>.<0-255>.<0-255>',
                RESERVED_TERMINATION:
                  'Maximum number of Reserved Terminations for this Gateway'
              }
            }
          }
        }
      }
    }
  };

  const getGwCapacityResponse = {
    name: 'GENBAND_G9_INTL',
    owner: 'NORTEL',
    maxEndpoints: 4094,
    typeList: ['trunk'],
    category: {
      __value: 1
    },
    gwcProfileNumber: 627,
    compatibleGWProfiles: ['GENBAND_G9_INTL'],
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
      __value: 4
    },
    inventoryType: 'Large Trunk Gateway',
    inventoryRole: 'Media Gateway',
    bearerFabricRestList: [],
    generateLGRP: 'true',
    resvTermMandatory: 'false',
    changeIPAvailable: 'false',
    dispPhyLocation: 'false',
    multiSiteNamesSupported: 'false',
    fqdnSupported: 'false',
    gwAppDataDefinitionList: [],
    lgrpType: 'NOT_SET',
    lgrpSize: -1,
    solutionRestList: []
  };

  const gwcNodebyNameResponse = {
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
      gwcProfileName: 'LARGE_LINENA_V4',
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
            __value: 16
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
            __value: 22
          },
          capacity: 1
        },
        {
          capability: {
            __value: 14
          },
          capacity: 0
        },
        {
          capability: {
            __value: 3
          },
          capacity: 4096
        },
        {
          capability: {
            __value: 23
          },
          capacity: 0
        },
        {
          capability: {
            __value: 6
          },
          capacity: 20
        },
        {
          capability: {
            __value: 1
          },
          capacity: 6400
        },
        {
          capability: {
            __value: 19
          },
          capacity: 0
        }
      ],
      bearerNetworkInstance: 'NET 2',
      bearerFabricType: 'IP',
      codecProfileName: 'tst',
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
  };
  const isLblResponse = true;
  const getProfileDataResponse = {
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
  const isSupportMltResponse = 'true';
  const commonService = jasmine.createSpyObj('commonService', [
    'showErrorMessage',
    'showAPIError',
    'showSuccessMessage'
  ]);

  const networkViewService = jasmine.createSpyObj('networkViewService', [
    'getProfileData'
  ]);
  const gatewayControllerService = jasmine.createSpyObj(
    'gatewayControllerService',
    [
      'getGwCapacity_Profiles',
      'isLblSupported',
      'getGWCNodeByName_v1',
      'isSupportMlt'
    ]
  );
  const formService = jasmine.createSpyObj('formService', [
    'get'
  ]);
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GatewayInformationComponent],
      imports: [AppModule, TranslateModule.forRoot()],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: CommonService, useValue: commonService },
        { provide: TranslateInternalService, useValue: translate },
        {
          provide: GatewayControllersService,
          useValue: gatewayControllerService
        },
        { provide: NetworkViewService, useValue: networkViewService },
        { provide: AssociateFormService, useValue: formService },
        FormBuilder
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(GatewayInformationComponent);
    component = fixture.componentInstance;
    fb = TestBed.inject(FormBuilder);
    (formService.gatewayInformation = fb.group({
      name: '',
      ipAddress: null,
      controllerName: '',
      profileName: '',
      reservedTerminations: null,
      pep_alg: ''
    }));
    (formService.gwcBackup = fb.group({
      lbl: false,
      mgcsecipAddress: '',
      secipAddress: '',
      cac: ''
    }));
    (component.gatewayOptions = {
      gatewayControllerName: ['gatewayControllerName'],
      gatewayProfileName: ['gatewayProfileName'],
      siteName: ['siteName']
    });
    component.form = formService.gatewayInformation;
    gatewayControllerService.getGwCapacity_Profiles.and.returnValue(
      of(getGwCapacityResponse)
    );
    gatewayControllerService.isSupportMlt.and.returnValue(
      of(isSupportMltResponse)
    );
    gatewayControllerService.getGWCNodeByName_v1.and.returnValue(
      of(gwcNodebyNameResponse)
    );
    gatewayControllerService.isLblSupported.and.returnValue(of(isLblResponse));
    networkViewService.getProfileData.and.returnValue(
      of(getProfileDataResponse)
    );
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reset values when showDialog changes to false', () => {
    component.showDialog = false;
    component.ngOnChanges({
      showDialog: {
        currentValue: false,
        previousValue: true,
        firstChange: false,
        isFirstChange: () => false
      }
    });

    expect(component.showSiteName).toBeFalse();
    expect(component.showlgrpType).toBeFalse();
    expect(component.endpointType).toBe(-1);
    expect(component.controllerNamePlaceHolder).toEqual('COMMON.SELECT');
    expect(component.lgrpTypeOptions).toEqual([]);
  });

  it('should set pepOrAlgLabel based on pep_alg_radioValue', () => {
    component.pep_alg_radioValue = 'pepServerName';
    component.ngOnChanges({
      pep_alg_radioValue: {
        currentValue: 'pepServerName',
        previousValue: 'algName',
        firstChange: false,
        isFirstChange: () => false
      }
    });
    expect(component.pepOrAlgLabel).toEqual(
      component.translateResults.GATEWAY_CONTROLLERS.ASSOCIATE_MEDIA_GW.FIELDS
        .GATEWAY_INFO.GATEWAY_PEP_SERVER
    );
  });

  it('should set pepOrAlgLabel based on pep_alg_radioValues', () => {
    component.pep_alg_radioValue = 'algName';
    component.ngOnChanges({
      pep_alg_radioValue: {
        currentValue: 'algName',
        previousValue: 'pepServerName',
        firstChange: false,
        isFirstChange: () => false
      }
    });
    expect(component.pepOrAlgLabel).toEqual(
      component.translateResults.GATEWAY_CONTROLLERS.ASSOCIATE_MEDIA_GW.FIELDS
        .GATEWAY_INFO.GATEWAY_ALG
    );
  });

  it('should call checkForGatewayLgrp and checkTGRPpanel with the provided controller name', () => {
    spyOn(component, 'checkForGatewayLgrp');
    spyOn(component, 'checkTGRPpanel');
    component.form.get('profileName')?.setValue('profile');
    const gwc = 'sampleControllerName';
    component.handleControllerNameChange(gwc);
    expect(component.checkForGatewayLgrp).toHaveBeenCalledWith(gwc);
    expect(component.checkTGRPpanel).toHaveBeenCalledWith(gwc);
  });

  it('should update properties and emit events based on the profile change', () => {
    spyOn(component.SignalProtocols, 'emit');
    spyOn(formService.gwcBackup, 'reset');
    spyOn(component.multisiteSelection, 'emit');
    spyOn(component.maxEndpoints, 'emit');
    spyOn(component, 'checkForGatewayLgrp');
    spyOn(component, 'checkGR_834GWName');
    spyOn(component, 'checkLGRPLocationPanel');
    spyOn(component, 'checkPEPServerALGPanel');
    spyOn(component, 'checkSignalingGatewayPanel');
    spyOn(component, 'checkTGRPpanel');
    const profile = 'profileName';
    component.form.get('controllerName')?.setValue('controller');
    component.handleProfileChange(profile);
    expect(component.SignalProtocols.emit).toHaveBeenCalled();
    expect(component.inventoryType).toEqual('Large Trunk Gateway');
    expect(component.category).toEqual(1);
    expect(component.lgrpTypeOptions).toEqual('NOT_SET'.split(','));
    expect(component.endpointType).toBe(4);
    // Check validators and reservedTerminationRequired
    if (getGwCapacityResponse.resvTermMandatory === 'true') {
      expect(
        component.form.get('reservedTerminations')?.validator
      ).toBeTruthy();
    }

    // Check multiSiteSelection and maxEndpoints
    expect(component.multiSiteSelection).toEqual(
      getGwCapacityResponse.multiSiteNamesSupported === 'true'
    );
    expect(component.multisiteSelection.emit).toHaveBeenCalledWith(
      component.multiSiteSelection
    );
    expect(component.maxEndpoints.emit).toHaveBeenCalledWith(
      getGwCapacityResponse.maxEndpoints
    );
    if (component.showSiteName) {
      expect(component.form.contains('siteName')).toBeTruthy();
    } else {
      expect(component.form.contains('siteName')).toBeFalsy();
    }
    if (component.form.get('controllerName')?.value) {
      expect(component.checkForGatewayLgrp).toHaveBeenCalledWith(
        component.form.get('controllerName')?.value
      );
      expect(component.checkTGRPpanel).toHaveBeenCalledWith(
        component.form.get('controllerName')?.value
      );
    }
    expect(component.checkGR_834GWName).toHaveBeenCalledWith(profile);
    expect(component.checkLGRPLocationPanel).toHaveBeenCalledWith(
      getGwCapacityResponse.dispPhyLocation
    );
    expect(component.checkPEPServerALGPanel).toHaveBeenCalledWith(profile);

    expect(component.checkSignalingGatewayPanel).toHaveBeenCalledWith(profile);
  });
  it('should check lgrp panel', () => {
    spyOn(component.LGRPPanel, 'emit');
    component.checkLGRPLocationPanel('true');
    expect(component.LGRPPanel.emit).toHaveBeenCalled();
    component.checkLGRPLocationPanel('false');
    expect(component.LGRPPanel.emit).toHaveBeenCalledWith(-1);
  });

  it('should emit true when isSupportMlt returns "true"', () => {
    spyOn(component.GRPanel, 'emit');
    component.checkGR_834GWName('someProfile');
    expect(component.GRPanel.emit).toHaveBeenCalledWith(true);
  });

  it('should emit true when serviceTypeMapping is 4', () => {
    spyOn(component.PEPServerALG, 'emit');
    component.checkPEPServerALGPanel('someProfile');
    expect(component.PEPServerALG.emit).toHaveBeenCalledWith(false);
    expect(component.controllerNamePlaceHolder).toEqual('COMMON.SELECT');
  });

  it('should emit true when checkgwcBackupPanel', () => {
    spyOn(component.gwcBackupPanel, 'emit');
    component.checkGwcBackupPanel('gwc');
    expect(networkViewService.getProfileData).toHaveBeenCalled();
    component.inventoryType = 'GEN';
    component.category = 1;
    component.checkGwcBackupPanel('gwc');
    expect(component.gwcBackupPanel.emit).toHaveBeenCalledWith(true);
  });

  it('should add lgrpType control if conditions are met', () => {
    component.multiSiteSelection = false;
    component.endpointType = 8;
    component.checkForGatewayLgrp('GWC-0');
    expect(component.form.get('lgrpType')).toBeDefined();
    expect(component.showlgrpType).toBe(true);
    component.endpointType = 2;
    component.checkForGatewayLgrp('GWC-0');
    expect(component.form.get('lgrpType')).toBeNull();
  });

  it('should emit true if profileName is GENBAND_G9_NA else false', () => {
    spyOn(component.signalingGateway, 'emit');
    component.checkSignalingGatewayPanel('GENBAND_G9_NA');
    expect(component.signalingGateway.emit).toHaveBeenCalledWith(true);
    component.checkSignalingGatewayPanel('s');
    expect(component.signalingGateway.emit).toHaveBeenCalledWith(false);
  });

  it('should emit true if conditions are met', () => {
    spyOn(component.TGRPPanel,'emit');
    component.form.get('profileName')?.setValue('Profile');
    const res = { serviceConfiguration: { gwcProfileName: 'TRUNKINTL_V2' } };
    gatewayControllerService.getGWCNodeByName_v1.and.returnValue(of(res));
    component.checkTGRPpanel('controllerName');
    expect(networkViewService.getProfileData).toHaveBeenCalledWith('Profile');
    component.form.get('profileName')?.setValue('');
    component.checkTGRPpanel('controllerName');
    expect(component.TGRPPanel.emit).toHaveBeenCalledWith(false);
  });

  it('should return true if ipAddress control is invalid and viceversa', () => {
    component.form.get('ipAddress')?.setErrors({ 'required': true });
    const result = component.ipAdressBlur();
    expect(result).toBeTrue();
  });

  it('should set showIsNodeSharing to true when lgrpType is LL_3RDPTY_FLEX and vice versa ', () => {
    const LL_3RDPTY_FLEX = 'LL_3RDPTY_FLEX';
    const FLEX='FLEX';
    component.handleLgrpTypeChange(LL_3RDPTY_FLEX);
    expect(component.showIsNodeSharing).toBeTrue();
    component.handleLgrpTypeChange(FLEX);
    expect(component.showIsNodeSharing).toBeFalse();
  });

  it('should prevent default for forbidden key codes', () => {
    const event = { key: '+', preventDefault: jasmine.createSpy('preventDefault') };
    component.keyPreventFn(event);
    expect(event.preventDefault).toHaveBeenCalled();
  });
});
