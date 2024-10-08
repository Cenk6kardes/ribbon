import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGwcNodeComponent } from './add-gwc-node.component';
import { AppModule } from 'src/app/app.module';
import { TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA, SimpleChanges } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { TranslateInternalService } from 'src/app/services/translate-internal.service';
import { NetworkViewService } from 'src/app/services/api/network-view.service';
import { GatewayControllersService } from '../../services/gateway-controllers.service';
import { of, throwError } from 'rxjs';

describe('AddGwcNodeComponent', () => {
  const translate = {
    translateResults: {
      GATEWAY_CONTROLLERS: {
        ADD_GWC_NODE: {
          TITLE: 'New GWC Node',
          HEADERS: {
            PROFILE_INFORMATION: 'Profile Information',
            FLOW_THROUGH_INFORMATION: 'Flow Through Information',
            GWC_BEARER_NETWORKS_CODEC_PROFILE_INFORMATION:
              'GWC Bearer Networks & Codec Profile Information',
            ADD_GWC_NODE: 'Add GWC Node'
          },
          FIELDS: {
            DEFAULT_DOMAIN_NAME: 'Default Domain Name',
            PROFILES: 'Profile(s)',
            TONE_DATA: 'Tone Data',
            EXEC_DATA: 'Exec Data',
            TERM_TYPE: 'Term Type',
            FLOW_THROUG_TO_SESSION_SERVER: 'Flow through to Session Server',
            GWC_ADDRESS_NAME: 'GWC Adress Name',
            BEARER_NETWORKS: 'Bearer Networks',
            GWC_CODEC_PROFILE: 'GWC Codec Profile'
          },
          ERRORS: {
            ALL_GWC_PROVISIONED: 'All GWC available are already provisioned',
            GWC_CODEC_REQUIRED:
              'GWC Codec Profile required.Please select an available Codec Profile, and try again. ',
            PROFILE_REQUIRED:
              'Profile(s) required.Please select an available Profile(s), and try again. ',
            FAILED_TO_ADD: 'Failed to add GWC'
          }
        }
      }
    }
  };

  const getGatewayControllerProfileDataResponse = {
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
      }
    ],
    compatibleProfiles: ['TRUNKNA_V2']
  };

  const addGWCtoCSsyncResponse = {
    operation: {
      __value: 0
    },
    rc: {
      __value: 0
    },
    responseMsg: 'Add GWC operation was successful',
    responseData: {
      ___gwcResp: null,
      ___gwcListResp: null,
      ___gwcPListResp: null,
      ___mgResp: null,
      ___mgListResp: null,
      ___a_MGResp: null,
      ___no_data: 'No Data',
      ___siteListResp: null,
      ___a_GWResp: null,
      ___c_MGResp: null,
      ___bearnetsListResp: null,
      ___lineEPListResp: null,
      __discriminator: {
        __value: 0
      },
      __uninitialized: false
    }
  };

  const addGwctoCSsync_v2Response = {
    operation: {
      __value: 0
    },
    rc: {
      __value: 0
    },
    responseMsg: 'Add GWC operation was successful',
    responseData: {
      ___gwcResp: null,
      ___gwcListResp: null,
      ___gwcPListResp: null,
      ___mgResp: null,
      ___mgListResp: null,
      ___a_MGResp: null,
      ___no_data: 'No Data',
      ___siteListResp: null,
      ___a_GWResp: null,
      ___c_MGResp: null,
      ___bearnetsListResp: null,
      ___lineEPListResp: null,
      __discriminator: {
        __value: 0
      },
      __uninitialized: false
    }
  };
  const getGatewayControllerProfilesResponse = [
    'AUDCNTL_RMGC_V2',
    'AUDCNTL_RMGCINTL_V2',
    'TRUNKINTL_V2',
    'TRUNKNA_V2',
    'TRUNKNA',
    'H.323_NA_V2',
    'TRUNKINTL',
    'SMALL_LINENA',
    'SMALL_LINEINTL',
    'AUDCNTL',
    'AUDCNTLINTL',
    'SIP-T',
    'SIP-TINTL',
    'SIP_LINEINTL',
    'LARGE_LINEINTL_V3',
    'V52TRUNK',
    'VRDN',
    'VRDNINTL',
    'BICC',
    'AUDCNTL_RMGC',
    'AUDCNTL_RMGCINTL',
    'H.323_NA',
    'H.323_INTL',
    'MTX_TRUNKNA',
    'MTX_TRUNKINTL',
    'H.323_INTL_V2',
    'SMALL_LINEINTL_V2',
    'LARGE_LINEINTL_V2',
    'LARGE_LINENA_V2',
    'LINE_TRUNK_AUD_INTL',
    'SMALL_LINENA_V2',
    'LARGE_LINEINTL',
    'LINE_TRUNK_AUD_INTL_V2',
    'LARGE_LINENA',
    'LARGE_LINENA_V3',
    'SIP_LINENA',
    'LINE_TRUNK_AUD_NA_V2',
    'LINE_TRUNK_AUD_NA',
    'LARGE_LINENA_V4',
    'LINE_TRUNK_AUD_NA_V3'
  ];
  const getLabModeResponse = false;

  const getGWCsConfiguredOnShelfResponse = [
    {
      gwcName: 'GWC-8',
      activeGwc: {
        name: 'GWC-8-ACTIVE',
        ipAddress: '10.254.166.56'
      },
      inactiveGwc: {
        name: 'GWC-8-INACTIVE',
        ipAddress: '10.254.166.57'
      },
      unit0: {
        name: 'GWC-8-UNIT-0',
        ipAddress: '10.254.166.58',
        loadLocation: ''
      },
      unit1: {
        name: 'GWC-8-UNIT-1',
        ipAddress: '10.254.166.59',
        loadLocation: ''
      },
      provisionedInEM: false
    }
  ];

  const getQueryNtwkCodecProfilesByFilter_v1Response = {
    count: 7,
    ncpList: [
      {
        name: '2j test',
        bearerPath: {
          __value: 1
        },
        defaultCodec: {
          __value: 0
        },
        preferredCodec: {
          __value: 2
        },
        alternativeCodec: {
          __value: 0
        },
        packetizationRate: {
          __value: 4
        },
        t38: {
          __value: 2
        },
        rfc2833: {
          __value: 1
        },
        comfortNoise: {
          __value: 1
        },
        bearerTypeDefault: {
          __value: 0
        },
        networkDefault: {
          __value: 0
        }
      },
      {
        name: 'asd',
        bearerPath: {
          __value: 1
        },
        defaultCodec: {
          __value: 0
        },
        preferredCodec: {
          __value: 2
        },
        alternativeCodec: {
          __value: 0
        },
        packetizationRate: {
          __value: 1
        },
        t38: {
          __value: 0
        },
        rfc2833: {
          __value: 0
        },
        comfortNoise: {
          __value: 0
        },
        bearerTypeDefault: {
          __value: 1
        },
        networkDefault: {
          __value: 0
        }
      },
      {
        name: 'default',
        bearerPath: {
          __value: 1
        },
        defaultCodec: {
          __value: 4
        },
        preferredCodec: {
          __value: 1
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
          __value: 0
        },
        networkDefault: {
          __value: 0
        }
      },
      {
        name: 'eski kod ile test',
        bearerPath: {
          __value: 1
        },
        defaultCodec: {
          __value: 0
        },
        preferredCodec: {
          __value: 2
        },
        alternativeCodec: {
          __value: 0
        },
        packetizationRate: {
          __value: 4
        },
        t38: {
          __value: 2
        },
        rfc2833: {
          __value: 1
        },
        comfortNoise: {
          __value: 1
        },
        bearerTypeDefault: {
          __value: 0
        },
        networkDefault: {
          __value: 0
        }
      },
      {
        name: 'eski kod ile test 2',
        bearerPath: {
          __value: 1
        },
        defaultCodec: {
          __value: 0
        },
        preferredCodec: {
          __value: 1
        },
        alternativeCodec: {
          __value: 0
        },
        packetizationRate: {
          __value: 3
        },
        t38: {
          __value: 1
        },
        rfc2833: {
          __value: 1
        },
        comfortNoise: {
          __value: 1
        },
        bearerTypeDefault: {
          __value: 0
        },
        networkDefault: {
          __value: 0
        }
      },
      {
        name: 'largeSDP1',
        bearerPath: {
          __value: 1
        },
        defaultCodec: {
          __value: 2
        },
        preferredCodec: {
          __value: 1
        },
        alternativeCodec: {
          __value: 4
        },
        packetizationRate: {
          __value: 2
        },
        t38: {
          __value: 1
        },
        rfc2833: {
          __value: 1
        },
        comfortNoise: {
          __value: 1
        },
        bearerTypeDefault: {
          __value: 0
        },
        networkDefault: {
          __value: 0
        }
      },
      {
        name: 'testfsdfs1',
        bearerPath: {
          __value: 1
        },
        defaultCodec: {
          __value: 2
        },
        preferredCodec: {
          __value: 1
        },
        alternativeCodec: {
          __value: 4
        },
        packetizationRate: {
          __value: 2
        },
        t38: {
          __value: 1
        },
        rfc2833: {
          __value: 1
        },
        comfortNoise: {
          __value: 1
        },
        bearerTypeDefault: {
          __value: 0
        },
        networkDefault: {
          __value: 0
        }
      }
    ]
  };

  const getFlowthroughStatusResponse = false;

  const commonService = jasmine.createSpyObj('commonService', [
    'showErrorMessage',
    'showAPIError',
    'showSuccessMessage',
    'showInfoMessage'
  ]);

  const networkViewService = jasmine.createSpyObj('networkViewService', [
    'getGatewayControllerProfileData',
    'getGatewayControllerProfiles'
  ]);
  const gatewayControllerService = jasmine.createSpyObj(
    'gatewayControllerService',
    [
      'getLabMode',
      'getGWCsConfiguredOnShelf',
      'getQueryNtwkCodecProfilesByFilter_v1',
      'getFlowthroughStatus',
      'addGWCtoCSsync',
      'addGwctoCSsync_v2'
    ]
  );

  let component: AddGwcNodeComponent;
  let fixture: ComponentFixture<AddGwcNodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddGwcNodeComponent],
      imports: [AppModule, TranslateModule.forRoot()],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: CommonService, useValue: commonService },
        { provide: TranslateInternalService, useValue: translate },
        {
          provide: GatewayControllersService,
          useValue: gatewayControllerService
        },
        { provide: NetworkViewService, useValue: networkViewService }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(AddGwcNodeComponent);
    component = fixture.componentInstance;
    networkViewService.getGatewayControllerProfileData.and.returnValue(
      of(getGatewayControllerProfileDataResponse)
    );
    networkViewService.getGatewayControllerProfiles.and.returnValue(
      of(getGatewayControllerProfilesResponse)
    );
    gatewayControllerService.getLabMode.and.returnValue(of(getLabModeResponse));
    gatewayControllerService.getGWCsConfiguredOnShelf.and.returnValue(
      of(getGWCsConfiguredOnShelfResponse)
    );
    gatewayControllerService.getQueryNtwkCodecProfilesByFilter_v1.and.returnValue(
      of(getQueryNtwkCodecProfilesByFilter_v1Response)
    );
    gatewayControllerService.getFlowthroughStatus.and.returnValue(
      of(getFlowthroughStatusResponse)
    );
    gatewayControllerService.addGWCtoCSsync.and.returnValue(
      of(addGWCtoCSsyncResponse)
    );
    gatewayControllerService.addGwctoCSsync_v2.and.returnValue(
      of(addGwctoCSsync_v2Response)
    );
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call initForm when ngOnChanges is called', () => {
    spyOn(component, 'initForm');

    const changes: SimpleChanges = {
      isShowNewGWCNodeDialog: {
        currentValue: true,
        previousValue: false,
        firstChange: false,
        isFirstChange: () => false
      }
    };

    component.ngOnChanges(changes);

    expect(component.initForm).toHaveBeenCalled();
  });

  it('should call getDatas when isShowNewGWCNodeDialog is true', () => {
    spyOn(component, 'getDatas');
    component.isShowNewGWCNodeDialog = true;
    const changes: SimpleChanges = {
      isShowNewGWCNodeDialog: {
        currentValue: true,
        previousValue: false,
        firstChange: false,
        isFirstChange: () => false
      }
    };

    component.ngOnChanges(changes);

    expect(component.getDatas).toHaveBeenCalled();
  });

  it('should get controllerName value', () => {
    component.initForm();
    component.form.get('controllerName')?.setValue('TestController');
    expect(component.controllerName).toEqual('TestController');
  });

  it('should get defaultDomainName value', () => {
    component.initForm();
    component.form.get('defaultDomainName')?.setValue('TestDomain');
    expect(component.defaultDomainName).toEqual('TestDomain');
  });

  it('should get profile control', () => {
    component.initForm();
    expect(component.profile).toBe(component.form.get('profile'));
  });

  it('should get gwcCodecProfile control', () => {
    component.initForm();
    expect(component.gwcCodecProfile).toBe(
      component.form.get('gwcCodecProfile')
    );
  });

  it('should get flowCheckBox value', () => {
    component.initForm();
    component.form.get('flowCheckBox')?.setValue(true);
    expect(component.flowCheckBox?.value).toEqual(true);
  });

  it('should get gwcAdressName control', () => {
    component.initForm();
    expect(component.gwcAdressName).toBe(component.form.get('gwcAdressName'));
  });

  it('should call getGatewayControllerProfileData and getFlowthroughStatus', () => {
    component.initForm();
    spyOn(component, 'getGatewayControllerProfileData');
    spyOn(component, 'getFlowthroughStatus');
    component.handleChangeProfile('testEvent');

    expect(component.getGatewayControllerProfileData).toHaveBeenCalledWith(
      'testEvent'
    );
    expect(component.getFlowthroughStatus).toHaveBeenCalledWith('testEvent');
  });

  it('should disable button when event is falsy', () => {
    component.handleControllerNameChange('');
    expect(component.disableButton).toBeTrue();
  });

  it('should enable button when event is truthy', () => {
    component.handleControllerNameChange('someValue');

    expect(component.disableButton).toBeFalse();
  });

  it('should enable gwcAdressName when event is truthy', () => {
    component.initForm();
    component.gwcAdressName?.setValue(null);

    component.handleflowCheckBox(true);

    expect(component.gwcAdressName?.enabled).toBeTrue();
  });

  it('should disable gwcAdressName when event is falsy', () => {
    component.initForm();
    component.gwcAdressName?.setValue(null);
    component.handleflowCheckBox(false);
    expect(component.gwcAdressName?.disabled).toBeTrue();
  });

  it('should set properties and form controls on successful API call', () => {
    component.initForm();
    const profile = 'TRUNKNA_V2';
    component.getGatewayControllerProfileData(profile);

    expect(component.execInfoOptions).toEqual({
      PRAB: ['UTR250'],
      ABTRK: ['GWCEX']
    });
    expect(component.termTypes).toEqual(['PRAB', 'ABTRK']);
    expect(component.form.get('termTypeFormGroup')?.get('PRAB')?.value).toEqual(
      'UTR250'
    );
    expect(component.toneValue).toEqual('NORTHAM');
  });

  it('should give error if api request has error', () => {
    component.initForm();
    networkViewService.getGatewayControllerProfileData.and.returnValue(
      throwError('error')
    );
    component.getGatewayControllerProfileData('profile');
    expect(commonService.showAPIError).toHaveBeenCalled();
  });

  it('should call all three API methods', () => {
    spyOn(component, 'getAllGatewayControllerProfiles');
    spyOn(component, 'getLabMode');
    spyOn(component, 'getqueryNtwkCodecProfilesByFilter');
    component.getDatas();

    expect(component.getAllGatewayControllerProfiles).toHaveBeenCalled();
    expect(component.getLabMode).toHaveBeenCalled();
    expect(component.getqueryNtwkCodecProfilesByFilter).toHaveBeenCalled();
  });

  it('should set gwcProfiles on successful API call', () => {
    component.getAllGatewayControllerProfiles();

    expect(component.options.gwcProfiles).toEqual(
      getGatewayControllerProfilesResponse
    );
    expect(component.isInprocess).toBeFalse();
  });

  it('should handle API error and show error message', () => {
    networkViewService.getGatewayControllerProfiles.and.returnValue(
      throwError('error')
    );
    component.getAllGatewayControllerProfiles();

    expect(commonService.showAPIError).toHaveBeenCalled();
  });

  it('should call getLabMode and if request is false should call getGWCsConfiguredOnShelf', () => {
    component.getLabMode();
    expect(gatewayControllerService.getLabMode).toHaveBeenCalled();
    expect(
      gatewayControllerService.getGWCsConfiguredOnShelf
    ).toHaveBeenCalledWith(false);
    expect(component.options.controllerName).toEqual(['GWC-8']);
  });

  it('should call getLabMode and if request is false should call getGWCsConfiguredOnShelf', () => {
    const getGWCsConfiguredOnShelfResponse2 = [
      {
        gwcName: 'GWC-8',
        activeGwc: {
          name: 'GWC-8-ACTIVE',
          ipAddress: '10.254.166.56'
        },
        inactiveGwc: {
          name: 'GWC-8-INACTIVE',
          ipAddress: '10.254.166.57'
        },
        unit0: {
          name: 'GWC-8-UNIT-0',
          ipAddress: '10.254.166.58',
          loadLocation: ''
        },
        unit1: {
          name: 'GWC-8-UNIT-1',
          ipAddress: '10.254.166.59',
          loadLocation: ''
        },
        provisionedInEM: false
      },
      {
        gwcName: 'GWC-3',
        activeGwc: {
          name: 'GWC-8-ACTIVE',
          ipAddress: '10.254.166.56'
        },
        inactiveGwc: {
          name: 'GWC-8-INACTIVE',
          ipAddress: '10.254.166.57'
        },
        unit0: {
          name: 'GWC-8-UNIT-0',
          ipAddress: '10.254.166.58',
          loadLocation: ''
        },
        unit1: {
          name: 'GWC-8-UNIT-1',
          ipAddress: '10.254.166.59',
          loadLocation: ''
        },
        provisionedInEM: false
      }
    ];
    gatewayControllerService.getGWCsConfiguredOnShelf.and.returnValue(of(getGWCsConfiguredOnShelfResponse2));
    component.getLabMode();
    expect(gatewayControllerService.getLabMode).toHaveBeenCalled();
    expect(
      gatewayControllerService.getGWCsConfiguredOnShelf
    ).toHaveBeenCalledWith(false);
    expect(component.options.controllerName).toEqual(['GWC-3','GWC-8']);
  });

  it('should closed dialog if there is no controller on response', () => {
    spyOn(component,'closeDialog');
    gatewayControllerService.getGWCsConfiguredOnShelf.and.returnValue(
      of([])
    );
    component.getLabMode();
    expect(gatewayControllerService.getLabMode).toHaveBeenCalled();
    expect(
      gatewayControllerService.getGWCsConfiguredOnShelf
    ).toHaveBeenCalledWith(false);
  });

  it('should set codecProfiles on successful API call', () => {
    component.getqueryNtwkCodecProfilesByFilter();

    expect(component.options.codecProfiles).toEqual([
      '2j test',
      'asd',
      'default',
      'eski kod ile test',
      'eski kod ile test 2',
      'largeSDP1',
      'testfsdfs1'
    ]);
  });

  it('should handle API error', () => {
    gatewayControllerService.getQueryNtwkCodecProfilesByFilter_v1.and.returnValue(
      throwError('Test API Error')
    );
    component.getqueryNtwkCodecProfilesByFilter();

    expect(commonService.showAPIError).toHaveBeenCalled();
  });

  it('should set isFlowThrough on successful API call', () => {
    component.getFlowthroughStatus('TestProfile');
    expect(component.isFlowThrough).toEqual(getFlowthroughStatusResponse);
  });

  it('should handle API error', () => {
    gatewayControllerService.getFlowthroughStatus.and.returnValue(
      throwError('Test API Error')
    );
    component.getFlowthroughStatus('Test');

    expect(commonService.showAPIError).toHaveBeenCalled();
  });

  it('should closeDialog onFormSubmit false ', () => {
    spyOn(component, 'closeDialog');
    component.onFormSubmit(false);
    expect(component.closeDialog).toHaveBeenCalled();
  });

  it('should show error message if profile invalid', () => {
    component.initForm();
    component.onFormSubmit(true);
    expect(commonService.showErrorMessage).toHaveBeenCalledWith(
      component.translateResults.GATEWAY_CONTROLLERS.ADD_GWC_NODE.ERRORS
        .PROFILE_REQUIRED
    );
  });

  it('should show error message if codec invalid', () => {
    component.initForm();
    component.profile?.clearValidators();
    component.form.updateValueAndValidity();
    component.profile?.updateValueAndValidity();
    component.onFormSubmit(true);
    expect(commonService.showErrorMessage).toHaveBeenCalledWith(
      component.translateResults.GATEWAY_CONTROLLERS.ADD_GWC_NODE.ERRORS
        .GWC_CODEC_REQUIRED
    );
  });

  it('should send add request ', () => {
    spyOn(component, 'addIfFlowthroughGWCTrue');
    spyOn(component, 'addIfFlowthroughGWCFalse');
    component.initForm();
    component.gwcCodecProfile?.setValue('asd');
    component.profile?.setValue('dsa');
    component.form.updateValueAndValidity();
    component.form.get('flowCheckBox')?.setValue(true);
    component.onFormSubmit(true);
    expect(component.addIfFlowthroughGWCTrue).toHaveBeenCalled();
    component.form.get('flowCheckBox')?.setValue(false);
    component.onFormSubmit(true);
    expect(component.addIfFlowthroughGWCFalse).toHaveBeenCalled();
  });

  it('should close dialog and perform cleanup', () => {
    component.initForm();
    spyOn(component.form, 'reset').and.callThrough();
    spyOn(component.form, 'removeControl').and.callThrough();
    spyOn(component.closeDialogEmitter, 'emit');

    component.closeDialog();

    expect(component.form.reset).toHaveBeenCalled();
    expect(component.form.removeControl).toHaveBeenCalledWith(
      'termTypeFormGroup'
    );

    expect(component.closeDialogEmitter.emit).toHaveBeenCalled();
  });

  it('should call addGWCtoCSsync', () => {
    const res = {
      rc: {
        __value: 5
      }
    };
    spyOn(component, 'closeDialog');
    component.initForm();
    component.form.get('controllerName')?.setValue('GWC-8');
    component.profile?.setValue('LINEFALANFILANBIRSEYLER');
    component.gwcCodecProfile?.setValue('OYOYOYYEDİBENİOMRUMDENDELIDELI');
    component.form.get('defaultDomainName')?.setValue('');
    component.addIfFlowthroughGWCFalse(['a'], ['b']);

    expect(gatewayControllerService.addGWCtoCSsync).toHaveBeenCalled();
    expect(commonService.showSuccessMessage).toHaveBeenCalled();
    expect(component.closeDialog).toHaveBeenCalled();
    gatewayControllerService.addGWCtoCSsync.and.returnValue(of(res));
    component.addIfFlowthroughGWCFalse(['a'], ['b']);
    expect(commonService.showErrorMessage).toHaveBeenCalled();
  });

  it('should call addGWCtoCSsyncV2', () => {
    const res = {
      rc: {
        __value: 5
      }
    };
    spyOn(component, 'closeDialog');
    component.initForm();
    component.form.get('controllerName')?.setValue('GWC-8');
    component.profile?.setValue('KOYSUn');
    component.gwcCodecProfile?.setValue('SILEMEZOBENI');
    component.form.get('defaultDomainName')?.setValue('');
    component.addIfFlowthroughGWCTrue(['a'], ['b']);
    expect(gatewayControllerService.addGwctoCSsync_v2).toHaveBeenCalled();
    expect(component.closeDialog).toHaveBeenCalled();
    expect(commonService.showSuccessMessage).toHaveBeenCalled();
    gatewayControllerService.addGwctoCSsync_v2.and.returnValue(of(res));
    component.addIfFlowthroughGWCTrue(['a'], ['b']);
    expect(commonService.showErrorMessage).toHaveBeenCalled();
  });

  it('closeAddErrorDialog should close dialog', () => {
    component.closeAddErrorDialog();
    expect(component.showAddErrorDialog).toBe(false);
    expect(component.showDetailsBtn).toBe(true);
  });

  it('should refreshTable call profiledatas', () => {
    spyOn(component, 'getGatewayControllerProfileData');
    component.initForm();
    component.profile?.setValue('asd');
    component.refreshTable();
    expect(component.getGatewayControllerProfileData).toHaveBeenCalledWith(
      component.profile?.value
    );
  });

  it('should showOrHideButton work', () => {
    component.showDetailsBtn = true;
    component.showOrHideButtonClick();
    expect(component.showDetailsBtn).toBe(false);
  });
});
