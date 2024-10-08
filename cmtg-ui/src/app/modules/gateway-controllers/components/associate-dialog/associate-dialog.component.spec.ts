import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociateDialogComponent } from './associate-dialog.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppModule } from 'src/app/app.module';
import { TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA, SimpleChanges } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { GatewayControllersService } from '../../services/gateway-controllers.service';
import { NetworkViewService } from 'src/app/services/api/network-view.service';
import { AssociateFormService } from '../../services/associate-form.service';
import { AuditService } from 'src/app/modules/audit/services/audit.service';
import { TranslateInternalService } from 'src/app/services/translate-internal.service';
import { of, throwError } from 'rxjs';
import { SupportedProtocols } from '../../models/gwControllers';

describe('AssociateDialogComponent', () => {
  let component: AssociateDialogComponent;
  let fixture: ComponentFixture<AssociateDialogComponent>;
  let fb: FormBuilder;
  const translate = {
    translateResults: {
      COMMON: {
        YES: 'Yes',
        NO: 'No'
      },
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
              'The IP address for this type of GW is',
            CONFIRM_DIALOG: 'Confirm',
            CONFIRMATION_DIALOG_CONTENT:
              'Current {{gwcName}}{{unit}} load version is lower than CVM16',
            CAC_CONFIRM_TITLE: 'Associate MG with Backup Path',
            ASSOCIATE_MG_TO_GWC: 'Successfully associated MG to a GWC!',
            ERROR: 'Failed to Associate',
            SUCCESS_MSG:'{{successMsg}} <br> GWC Name: {{gwcName}} <br> GWC IP: {{gwcIP}} <br> GW Node Name: {{gwcNodeName}}'
          },
          GWC_ERROR_MSG: {
            MGC_SECIP_INVALID:
              'MGC Secondary IP Address cannot be specified as 0.0.0.0 or 255.255.255.255 Associate MG with Backup Path',
            GW_SECIP_EMPTY:
              'Gateway cannot be added with backup path because GW Secondary IP Address is not specified. Associate MG with Backup Path',
            GW_SECIP_INVALID:
              'Gateway Secondary IP Address cannot be specified as 0.0.0.0 or 255.255.255.255 Associate MG with Backup Path'
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

  const getAllsupportedGatewayProfilesResponse = [
    'AMBIT_LINE_GW_16',
    'ASKEY_LINE_GW_12',
    'ASKEY_LINE_GW_30',
    'ASKEY_LINE_GW_4',
    'CALIX_C7',
    'GENBAND_G2_PLG',
    'GENBAND_G2_TGW',
    'GENBAND_G2_TGW_TEXT_IUAIID',
    'GENBAND_G6_PLG',
    'GENBAND_G6_PLG_1K',
    'GENBAND_G6_TGW',
    'GENBAND_G6_TGW_TEXT_IUAIID',
    'GENBAND_G9_INTL',
    'GENBAND_G9_NA',
    'GENBAND_G9_V52',
    'GENBAND_MS',
    'HUAWEI_TRUNK_INTL',
    'HUAWEI_TRUNK_NA',
    'KEYMILE_UMUX',
    'MEDIATRIX_LINE_GW_1',
    'MEDIATRIX_LINE_GW_16',
    'MEDIATRIX_LINE_GW_2',
    'MEDIATRIX_LINE_GW_24',
    'MEDIATRIX_LINE_GW_4',
    'MEDIATRIX_LINE_GW_8',
    'MEDIA_SRV_6310_LINE',
    'MEDIA_SRV_MS2030',
    'MG32LN',
    'MG3600_4U',
    'MG3600_8U',
    'MGCP_IAD_40',
    'MGCP_LINE_GW_1',
    'MILEGATE',
    'MOTOROLAMTA_1',
    'MOTOROLAMTA_2',
    'MOTOROLAMTA_4',
    'MS',
    'MSAN_2K',
    'NUERA_BTX4K',
    'SIPVOICE',
    'TEKTRONIX_NCS_POWERPROBE',
    'TGCP',
    'TMG3200_E1',
    'TMG3200_T1',
    'TMG800_E1',
    'TMG800_T1',
    'TOUCHTONE_NN01_1',
    'TOUCHTONE_NN01_2',
    'TOUCHTONE_NN01_3',
    'TOUCHTONE_NN01_4',
    'UE9000MG_ABI_IP',
    'UE9000MG_IP',
    'VOIP_VPN'
  ];

  const getGwcNamesResponse = [
    'GWC-8',
    'GWC-0',
    'GWC-1',
    'GWC-2',
    'GWC-3',
    'GWC-4',
    'GWC-5',
    'GWC-6',
    'GWC-7'
  ];
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

  const getGatewaySiteResponse = [
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

  const getUnitStatusResponse = {
    unit0ID: '10.254.166.18:161',
    unit0IPAddr: '10.254.166.18',
    unit0Port: 161,
    unit1ID: '10.254.166.19:161',
    unit1IPAddr: '10.254.166.19',
    unit1Port: 161
  };
  const putAssociateMediaGatewayResponse = {
    operation: {
      __value: 10
    },
    rc: {
      __value: 0
    },
    responseMsg: 'The MG was successfully associated with a GWC',
    responseData: {
      ___gwcResp: null,
      ___gwcListResp: null,
      ___gwcPListResp: null,
      ___mgResp: null,
      ___mgListResp: null,
      ___a_MGResp: null,
      ___no_data: null,
      ___siteListResp: null,
      ___a_GWResp: {
        tagValSeq: [
          {
            tag: 'gwcUIName',
            value: 'GWC-0'
          },
          {
            tag: 'gwcIpAddr',
            value: '10.254.166.16'
          },
          {
            tag: 'mgNodeName',
            value: 'GWC 0'
          }
        ]
      },
      ___c_MGResp: null,
      ___bearnetsListResp: null,
      ___lineEPListResp: null,
      __discriminator: {
        __value: 7
      },
      __uninitialized: false
    }
  };
  const commonService = jasmine.createSpyObj('commonService', [
    'showErrorMessage',
    'showAPIError',
    'showSuccessMessage',
    'showInfoMessage'
  ]);
  const auditService = jasmine.createSpyObj('auditService', [
    'getRunningAudit'
  ]);

  const networkViewService = jasmine.createSpyObj('networkViewService', [
    'getAllSupportedGatewayProfiles',
    'getGWCNames',
    'getProfileData'
  ]);
  const gatewayControllerService = jasmine.createSpyObj(
    'gatewayControllerService',
    [
      'getGatewaySiteName',
      'getUnitStatus',
      'getGWCLoadName2',
      'getGWCLoadName2',
      'putAssociateMediaGateway',
      'getIpAddressProtocolPort'
    ]
  );
  const formService = jasmine.createSpyObj('formService', ['get']);
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssociateDialogComponent],
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
        { provide: AuditService, useValue: auditService },
        FormBuilder
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AssociateDialogComponent);
    component = fixture.componentInstance;
    fb = TestBed.inject(FormBuilder);
    (formService.mainFormGroup = fb.group({
      gatewayInformation: fb.group({
        name: '',
        ipAddress: null,
        controllerName: '',
        profileName: '',
        reservedTerminations: null,
        pep_alg: ''
      }),
      signalProtocol: fb.group({
        protocolType: '',
        protocolPort: null,
        protocolVersion: ''
      }),
      gwcBackup: fb.group({
        lbl: false,
        mgcsecipAddress: [''],
        secipAddress: [''],
        cac: ['']
      })
    }));
    (component.mainForm = formService.mainFormGroup);
    component.gatewayInformation = component.mainForm.get(
      'gatewayInformation'
    ) as FormGroup;
    component.gwcBackup = component.mainForm.get('gwcBackup') as FormGroup;
    component.signalProtocol = component.mainForm.get(
      'signalProtocol'
    ) as FormGroup;
    networkViewService.getAllSupportedGatewayProfiles.and.returnValue(
      of(getAllsupportedGatewayProfilesResponse)
    );
    networkViewService.getGWCNames.and.returnValue(of(getGwcNamesResponse));
    networkViewService.getProfileData.and.returnValue(
      of(getProfileDataResponse)
    );
    gatewayControllerService.getGatewaySiteName.and.returnValue(
      of(getGatewaySiteResponse)
    );
    gatewayControllerService.getUnitStatus.and.returnValue(
      of(getUnitStatusResponse)
    );
    gatewayControllerService.getGWCLoadName2.and.returnValue(of('GL230BG'));
    gatewayControllerService.putAssociateMediaGateway.and.returnValue(
      of(putAssociateMediaGatewayResponse)
    );
    gatewayControllerService.getIpAddressProtocolPort.and.returnValue(of(true));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe to form statusChanges and update controllerName when showDialog changes', () => {
    component.showDialog = true;
    const changes: SimpleChanges = {
      showDialog: {
        currentValue: true,
        previousValue: false,
        firstChange: false,
        isFirstChange: () => false
      }
    };

    component.showDialog = true;
    component.gwcname = 'controller1';

    component.ngOnChanges(changes);
    expect(component.disableSubmit).toBeFalse();
    component.gwcname = '';
    component.ngOnChanges(changes);
  });

  it('should subscribe to form statusChanges disable the button', () => {
    component.showDialog = true;
    component.gatewayInformation
      .get('controllerName')
      ?.addValidators(Validators.required);
    const changes: SimpleChanges = {
      showDialog: {
        currentValue: true,
        previousValue: false,
        firstChange: false,
        isFirstChange: () => false
      }
    };
    component.showDialog = true;
    component.ngOnChanges(changes);
    expect(component.disableSubmit).toBeTrue();
  });

  it('should disable/enable reservedTermination', () => {
    component.multisiteSelection(true);
    expect(
      component.gatewayInformation.get('reservedTerminations')?.disabled
    ).toBeTrue();
    expect(component.multiSiteSelection).toBeTrue();
    component.multisiteSelection(false);
    expect(
      component.gatewayInformation.get('reservedTerminations')?.enabled
    ).toBeTrue();
    expect(component.multiSiteSelection).toBeFalse();
  });

  it('should set maxEndpoints property correctly', () => {
    const maxEndpointValue = 10;
    component.maxEndpoint(maxEndpointValue);
    expect(component.maxEndpoints).toEqual(maxEndpointValue);
  });
  it('should set showSignalingGatewayPanel property correctly', () => {
    const signalingGatewayPanelValue = true;
    component.signalingGateway(signalingGatewayPanelValue);
    expect(component.showSignalingGatewayPanel).toEqual(
      signalingGatewayPanelValue
    );
  });
  it('should set showTGRPPanel property correctly', () => {
    const TGRPPanelValue = true;
    component.TGRPPanel(TGRPPanelValue);
    expect(component.showTGRPPanel).toEqual(TGRPPanelValue);
  });

  it('should set showGwcBackup property correctly', () => {
    const isGwcBackupValue = true;
    component.gwcBackupPanel(isGwcBackupValue);
    expect(component.showGwcBackup).toEqual(isGwcBackupValue);
  });

  it('should set showGRPanel property correctly', () => {
    const GRPanelValue = true;
    component.GRPanel(GRPanelValue);
    expect(component.showGRPanel).toEqual(GRPanelValue);
  });

  it('should set signalProtocols property correctly', () => {
    const supportedProtocols: SupportedProtocols[] = [];
    component.SignalProtocols(supportedProtocols);
    expect(component.signalProtocols).toEqual(supportedProtocols);
  });

  it('should set selectedSiteNames property correctly', () => {
    const mockSiteNames = { timeout: 2, selectedSiteNames: ['site'] };
    component.siteNames(mockSiteNames);
    expect(component.selectedSiteNames).toEqual(mockSiteNames);
  });

  it('should set showLGRPLocationPanel property correctly', () => {
    const mockEndpointNumber = -1;
    component.LGRPLocationPanel(mockEndpointNumber);
    expect(component.showLGRPLocationPanel).toBeFalse();
    component.LGRPLocationPanel(2);
    expect(component.showLGRPLocationPanel).toBeTrue();
    expect(component.endpointNumber).toEqual(2);
  });

  it('should set showPEPServerALG property correctly for false value', () => {
    const mockShowValue = false;
    component.PEPServerALGPanel(mockShowValue);
    expect(component.showPEPServerALG).toBeFalse();
  });

  it('should set pep_alg_radioValue property correctly', () => {
    const mockSelectedValue = 'ex';
    component.pep_alg_radio(mockSelectedValue);
    expect(component.pep_alg_radioValue).toEqual(mockSelectedValue);
  });

  it('should close dialog and reset form properties correctly', () => {
    spyOn(component.closeDetailDialog, 'emit');
    component.closeDialog();
    expect(component.showLGRPLocationPanel).toBe(false);
    expect(component.showPEPServerALG).toBe(false);
    expect(component.showSignalingGatewayPanel).toBe(false);
    expect(component.showTGRPPanel).toBe(false);
    expect(component.showGRPanel).toBe(false);
    expect(component.multiSiteSelection).toBe(false);
    expect(component.closeDetailDialog.emit).toHaveBeenCalled();
  });

  it('should check if audit is running when event is true or close dialog on false', () => {
    spyOn(component, 'checkIsAuditRunning');
    spyOn(component, 'closeDialog');
    component.onAssociateFormSubmit(true);
    expect(component.checkIsAuditRunning).toHaveBeenCalled();
    component.onAssociateFormSubmit(false);
    expect(component.closeDialog).toHaveBeenCalled();
  });

  it('should handle audit ', () => {
    spyOn(component, 'genbandProfileNamesValidation');
    spyOn(component, 'IfGWIPEmpty');
    auditService.getRunningAudit.and.returnValue(of(['audit1', 'audit2']));
    component.checkIsAuditRunning();
    expect(component.detailsText).toEqual(
      translate.translateResults.GATEWAY_CONTROLLERS.ASSOCIATE_MEDIA_GW.LABEL
        .AUDIT_DETAIL
    );
    expect(component.messageText).toEqual(
      translate.translateResults.GATEWAY_CONTROLLERS.ASSOCIATE_MEDIA_GW.LABEL
        .FAILED_TO_ASSOCIATE
    );
    expect(component.isInprocess).toBeFalsy();
    expect(component.showAddErrorDialog).toBeTruthy();
    auditService.getRunningAudit.and.returnValue(of([]));
    component.checkIsAuditRunning();
    expect(component.IfGWIPEmpty).toHaveBeenCalled();
    component.gatewayInformation.get('ipAddress')?.setValue('123.123.123.123');
    component.checkIsAuditRunning();
    expect(component.genbandProfileNamesValidation).toHaveBeenCalled();
    auditService.getRunningAudit.and.returnValue(throwError('err'));
    component.checkIsAuditRunning();
    expect(component.isInprocess).toBeFalse();
    expect(commonService.showAPIError).toHaveBeenCalledWith('err');
  });

  it('should IFGWIPEMTpy run correctly', () => {
    spyOn(component, 'genbandProfileNamesValidation');
    component.IfGWIPEmpty();
    expect(commonService.showErrorMessage).toHaveBeenCalled();
    networkViewService.getProfileData.and.returnValue(
      of({
        serviceTypes: [
          {
            __value: 1
          },
          {
            __value: 5
          }
        ],
        category: {
          __value: 1
        }
      })
    );
    component.IfGWIPEmpty();
    networkViewService.getProfileData.and.returnValue(
      of({
        serviceTypes: [
          {
            __value: 1
          },
          {
            __value: 5
          }
        ],
        category: {
          __value: 2
        }
      })
    );
    expect(component.gatewayInformation.get('ipAddress')?.value).toBe(
      '0.0.0.0'
    );
    component.IfGWIPEmpty();
    networkViewService.getProfileData.and.returnValue(throwError('err'));
    component.IfGWIPEmpty();
    expect(commonService.showAPIError).toHaveBeenCalledWith('err');
    expect(component.isInprocess).toBeFalse();
  });

  it('should genbandProfileNamesValidation getGwcError', () => {
    spyOn(component, 'checkBackupPath');
    spyOn(component, 'genbandProfileCheckingUnits').and.returnValue({
      unitFlag: true,
      loadVersion: 'GL16'
    });
    component.gatewayInformation
      .get('profileName')
      ?.setValue('GENBAND_G9_INTL');
    component.gatewayInformation.get('controllerName')?.setValue('GWC-0');

    gatewayControllerService.getGWCLoadName2.and.returnValue(throwError('err'));
    component.genbandProfileNamesValidation();
    expect(commonService.showAPIError).toHaveBeenCalledWith('err');
  });

  it('should genbandProfileNamesValidation', () => {
    spyOn(component, 'checkBackupPath');
    spyOn(component, 'genbandProfileCheckingUnits').and.returnValue({
      unitFlag: true,
      loadVersion: 'GL16'
    });
    component.gatewayInformation
      .get('profileName')
      ?.setValue('GENBAND_G9_INTL');
    component.gatewayInformation.get('controllerName')?.setValue('GWC-0');
    component.genbandProfileNamesValidation();
    component.gatewayInformation.get('profileName')?.setValue('Voip');
    component.genbandProfileNamesValidation();
    expect(component.checkBackupPath).toHaveBeenCalled();
    expect(gatewayControllerService.getUnitStatus).toHaveBeenCalledWith(
      'GWC-0'
    );
    expect(gatewayControllerService.getGWCLoadName2).toHaveBeenCalled();
  });

  it('should genbandProfileCheckingUnits runs correctly', () => {
    const gwcLoad = 'GC17';
    const loadVersion = 'GC16';
    const result = component.genbandProfileCheckingUnits(gwcLoad, loadVersion);

    expect(result.unitFlag).toBeFalsy();
    expect(result.loadVersion).toBe('GC16');
    const result2 = component.genbandProfileCheckingUnits('GL16', loadVersion);
  });

  it('should show error message when secipAddress is empty', () => {
    spyOn(component, 'createRequestBody');
    component.showGwcBackup = true;
    component.gwcBackup.get('lbl')?.setValue(true);
    component.gwcBackup.get('secipAddress')?.setValue('');

    component.checkBackupPath();

    expect(commonService.showErrorMessage).toHaveBeenCalledWith(
      translate.translateResults.GATEWAY_CONTROLLERS.ASSOCIATE_MEDIA_GW
        .GWC_ERROR_MSG.GW_SECIP_EMPTY
    );
  });

  it('should show error message when secip 0000  ', () => {
    spyOn(component, 'createRequestBody');
    component.showGwcBackup = true;
    component.gwcBackup.get('lbl')?.setValue(true);
    component.gwcBackup.get('secipAddress')?.setValue('0.0.0.0');

    component.checkBackupPath();

    expect(commonService.showErrorMessage).toHaveBeenCalled();
  });

  it('should show error message when mgsec is empty ', () => {
    spyOn(component, 'createRequestBody');
    component.showGwcBackup = true;
    component.gwcBackup.get('lbl')?.setValue(true);
    component.gwcBackup.get('mgcsecipAddress')?.setValue('0.0.0.0');

    component.checkBackupPath();

    expect(commonService.showErrorMessage).toHaveBeenCalledWith(
      translate.translateResults.GATEWAY_CONTROLLERS.ASSOCIATE_MEDIA_GW
        .GWC_ERROR_MSG.MGC_SECIP_INVALID
    );
  });

  it('should run checkbakcup ', () => {
    spyOn(component, 'createRequestBody');
    component.showGwcBackup = true;
    component.gwcBackup.get('lbl')?.setValue(true);
    component.gwcBackup.get('secipAddress')?.setValue('123.123.123.123');
    component.gwcBackup.get('mgcsecipAddress')?.setValue('123.123.123.123');
    component.checkBackupPath();
    component.gwcBackup.get('cac')?.setValue('0');
    component.checkBackupPath();
  });

  it('should handle API error', () => {
    const profileName = 'profilename';
    const ipAddress = '123.123.123.12';
    const portNumber = '2';
    gatewayControllerService.getIpAddressProtocolPort.and.returnValue(
      throwError('err')
    );
    component.checkIpAddressProtocolPort(profileName, ipAddress, portNumber);

    // Assert
    expect(commonService.showAPIError).toHaveBeenCalledWith('err');
  });

  it('should run checkIpAddress', () => {
    const profileName = 'profilename';
    const ipAddress = '123.123.123.12';
    const portNumber = '2';
    component.checkIpAddressProtocolPort(profileName, ipAddress, portNumber);
    expect(commonService.showInfoMessage).toHaveBeenCalled();
  });

  it('should return "undefined" when protocol type is not found', () => {
    const protocolType = 'unknownType';
    const result = component.findProtocolTypeValue(protocolType);
    expect(result).toBe('undefined');
  });

  it('should return protocol value when protocol type is found', () => {
    const protocolType = 'NCS (1)';
    const result = component.findProtocolTypeValue(protocolType);
    expect(result).toBe('1');
  });

  it('should handle genbandConfirmDialogEvent true', () => {
    spyOn(component, 'checkBackupPath');
    component.genbandConfirmDialogEvent(true);
    expect(component.checkBackupPath).toHaveBeenCalled();
  });

  it('should handle genbandConfirmDialogEvent false', () => {
    component.genbandConfirmDialogEvent(false);
    expect(component.confirmDialog.isShowConfirmDialog).toBeFalse();
  });

  it('should toggle showDetailsBtn on showOrHideButtonClick', () => {
    component.showDetailsBtn = false;
    component.showOrHideButtonClick();
    expect(component.showDetailsBtn).toBe(true);
  });

  it('should close add error dialog and set showDetailsBtn to true', () => {
    component.closeAddErrorDialog();
    expect(component.showAddErrorDialog).toBe(false);
    expect(component.showDetailsBtn).toBe(true);
  });

  it('should create the request body with correct values', () => {
    spyOn(component, 'findProtocolTypeValue').and.returnValue('2');
    component.multiSiteSelection = true;
    component.pep_alg_radioValue = 'pepServerName';
    component.selectedSiteNames.selectedSiteNames = ['a', 'b'];
    component.gatewayInformation.get('pep_alg')?.setValue('pepServerName');
    component.gatewayInformation.get('reservedTerminations')?.setValue(2);
    component.gatewayInformation.get('siteName')?.setValue('CO361');
    component.gatewayInformation.get('controllerName')?.setValue('GWC-0');
    component.signalProtocol.get('protocolVersion')?.setValue('1.0');
    component.gatewayInformation.get('name')?.setValue('tst');
    component.gatewayInformation.get('profileName')?.setValue('VOIP_VPN');
    component.gatewayInformation.get('ipAddress')?.setValue('123.123.123.123');
    component.signalProtocol.get('protocolPort')?.setValue('2');
    component.gatewayInformation.get('lgrpType')?.setValue('2');
    component.createRequestBody();
    component.gatewayInformation.get('pep_alg')?.setValue('algName');
    component.createRequestBody();
    expect(
      gatewayControllerService.putAssociateMediaGateway
    ).toHaveBeenCalled();
  });

  it('should create the request body throw error', () => {
    spyOn(component, 'findProtocolTypeValue').and.returnValue('2');
    gatewayControllerService.putAssociateMediaGateway.and.returnValue(
      throwError('err')
    );
    component.multiSiteSelection = true;
    component.selectedSiteNames.selectedSiteNames = ['a', 'b'];
    component.gatewayInformation.get('pep_alg')?.setValue('pepServerName');
    component.gatewayInformation.get('reservedTerminations')?.setValue(2);
    component.gatewayInformation.get('siteName')?.setValue('CO361');
    component.gatewayInformation.get('controllerName')?.setValue('GWC-0');
    component.signalProtocol.get('protocolVersion')?.setValue('1.0');
    component.gatewayInformation.get('name')?.setValue('tst');
    component.gatewayInformation.get('profileName')?.setValue('VOIP_VPN');
    component.gatewayInformation.get('ipAddress')?.setValue('123.123.123.123');
    component.signalProtocol.get('protocolPort')?.setValue('2');
    component.gatewayInformation.get('lgrpType')?.setValue('2');
    component.createRequestBody();
    expect(commonService.showAPIError).toHaveBeenCalledWith('err');
  });

  it('should create the request body throw error', () => {
    spyOn(component, 'findProtocolTypeValue').and.returnValue('2');
    gatewayControllerService.putAssociateMediaGateway.and.returnValue(
      of({ rc: { __value: 3 } })
    );
    component.createRequestBody();
    expect(component.showAddErrorDialog).toBeTrue();
  });

  it('should fetch gateway information options throws error', () => {
    const mockValues = {
      gatewayProfileName: ['Profile1', 'Profile2'],
      gatewayControllerName: ['Controller1', 'Controller2'],
      siteName: 'Site1'
    };

    networkViewService.getAllSupportedGatewayProfiles.and.returnValue(
      of(mockValues.gatewayProfileName)
    );
    networkViewService.getGWCNames.and.returnValue(throwError('err'));
    gatewayControllerService.getGatewaySiteName.and.returnValue(
      of(mockValues.siteName)
    );
    component.getGatewayInformationOptions();
    expect(commonService.showAPIError).toHaveBeenCalledWith('err');
  });

  it('should hide success confirm dialog and close associate dialog', () => {
    spyOn(component,'closeDialog');
    component.successConfirm.isShowConfirmDialog = true;
    component.successAssociateConfirm();
    expect(component.successConfirm.isShowConfirmDialog).toBeFalse();
    expect(component.closeDialog).toHaveBeenCalled();
  });
});
