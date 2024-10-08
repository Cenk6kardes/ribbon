import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick
} from '@angular/core/testing';

import { GatewayControllersComponent } from './gateway-controllers.component';
import { FormBuilder } from '@angular/forms';
import { CommonService } from 'src/app/services/common.service';
import { TranslateInternalService } from 'src/app/services/translate-internal.service';
import { GatewayControllersService } from './services/gateway-controllers.service';
import { AppModule } from 'src/app/app.module';
import { TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of, throwError } from 'rxjs';
import { AuthenticationService } from 'src/app/auth/services/authentication.service';
import { NetworkViewService } from 'src/app/services/api/network-view.service';
import { SafePipe } from 'src/app/shared/pipes/safe.pipe';

describe('GatewayControllersComponent', () => {
  let component: GatewayControllersComponent;
  let fixture: ComponentFixture<GatewayControllersComponent>;
  let formBuilder: FormBuilder;
  const translate = {
    translateResults: {
      COMMON: {
        DELETE: 'Delete',
        OK: 'OK',
        CLOSE: 'Close',
        CANCEL: 'Cancel',
        SAVE: 'Save',
        ERROR: 'Error',
        ADD: 'Add',
        YES: 'Yes',
        NO: 'No',
        SELECT: 'Select',
        RESET: 'Reset'
      },
      GATEWAY_CONTROLLERS: {
        TITLE: 'Gateway Controllers',
        SELECT_GW: 'Select a Gateway Controller',
        UNIT_0: 'Unit 0',
        UNIT_1: 'Unit 1',
        OVERLAY_BUTTONS: {
          DISASSOCIATE_GW: 'Disassociate Media Gateway',
          DELETE_GWC_NODE: 'Delete GWC Node'
        },
        ASSOCIATE_MEDIA_GW: {
          LABEL: 'Associate Media Gateway'
        },
        DISASSOCIATE: {
          TITLE: 'Disassociate Media Gateway',
          GW_NAME: 'Gateway Name',
          CONFIRM_TITLE: 'Confirm Gateway Deletion',
          CONFIRM_CONTENT:
            ` This operation will disassociate Gateway \'{{gwName}}\' from its<br>Gateway Controller which will result
            in a complete loss of service<br>for the Gateway.` +
            ` This service loss includes the disruption of all active<br>and in progress calls that may be established
            on the Gateway. <br> Are you sure that you want to delete the gateway \'{{gwName}}\' ? `,
          CONFIRM_MSG: {
            CODE_0: 'Successfully disassociated MG!',
            CODE_26: 'Failed to disassociate MG. Invalid input.',
            CODE_31:
              'Failed to disassociate MG. Unable to deassign LGRP node name for the MG.',
            CODE_UNKNOWN: 'Failed to disassociate MG.'
          }
        },
        DELETE_GWC_NODE: {
          TITLE: 'Delete GWC Node',
          GW_NAME: 'Gateway Controller Name',
          CONFIRM_TITLE: 'Confirm Gateway Controller Deletion',
          CONFIRM_CONTENT:
            ' Are you sure that you want to delete<br>gateway controller \'{{gwName}}\' ?',
          FAILED_MESSAGE: 'Failed to Delete GWC'
        },
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

  const commonServiceMock = jasmine.createSpyObj('commonService', [
    'showAPIError',
    'showErrorMessage',
    'showSuccessMessage'
  ]);

  const gwcServiceMock = jasmine.createSpyObj('gwcService', [
    'getGwcList',
    'deleteDisAssocMGsync',
    'getUnitStatus',
    'getGWCNodeByName_v1',
    'getFlowthroughStatus',
    'deleteGWCfrmCSsync',
    'deleteGWCfrmCSsync_v2'
  ]);

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

  const nvServiceMock = jasmine.createSpyObj('nvService', ['getAllGwc']);

  const authServiceMock = jasmine.createSpyObj('authService', ['getCLLI']);

  const clliResponse = 'CO39';

  const getAllGwcRes = [
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

  const getGwcListRes = [
    {
      devEquipmentName: 'GWC-0',
      devType: 'Gateway Controller',
      contextName: '',
      contextID: '00 00 00 63 00 00 00 a1 0a fe a6 10',
      community: 'public',
      timeout: '',
      retryCount: '',
      mpModel: '1',
      securityModel: '',
      securityLevel: '',
      ipAddress: '10.254.166.16',
      devicePort: '161'
    }
  ];

  const getUnitStatusRes = {
    unit0ID: '10.254.166.18:161',
    unit0IPAddr: '10.254.166.18',
    unit0Port: 161,
    unit1ID: '10.254.166.19:161',
    unit1IPAddr: '10.254.166.19',
    unit1Port: 161
  };

  const deleteDisAssocMGsyncRes_CodeUnknown = {
    operation: {
      __value: 4
    },
    rc: {
      __value: 26
    },
    responseMsg: 'The Gateway name is invalid',
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

  const flowThroughTrue = true;

  const deleteGWCfrmCSsyncRes = {
    operation: {
      __value: 1
    },
    rc: {
      __value: 0
    },
    responseMsg: 'Delete GWC operation was successful',
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

  const deleteGWCfrmCSsync_v2Res = {
    operation: {
      __value: 1
    },
    rc: {
      __value: 0
    },
    responseMsg: 'Delete GWC operation was successful',
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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GatewayControllersComponent,SafePipe],
      providers: [
        { provide: GatewayControllersService, useValue: gwcServiceMock },
        { provide: CommonService, useValue: commonServiceMock },
        { provide: TranslateInternalService, useValue: translate },
        { provide: AuthenticationService, useValue: authServiceMock },
        { provide: NetworkViewService, useValue: nvServiceMock },
        FormBuilder
      ],
      imports: [AppModule, TranslateModule.forRoot()],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(GatewayControllersComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);
    component.disassociateForm = formBuilder.group({
      gwName: ''
    });
    component.deleteGwcNodeForm = formBuilder.group({
      gwcName: ''
    });
    gwcServiceMock.getGwcList.and.returnValue(of(getGwcListRes));
    gwcServiceMock.deleteDisAssocMGsync.and.returnValue(
      of(deleteDisAssocMGsyncRes_CodeUnknown)
    );
    gwcServiceMock.getUnitStatus.and.returnValue(of(getUnitStatusRes));
    gwcServiceMock.getGWCNodeByName_v1.and.returnValue(of(getGWCNodeByName_v1Res));
    gwcServiceMock.getFlowthroughStatus.and.returnValue(of(flowThroughTrue));
    gwcServiceMock.deleteGWCfrmCSsync.and.returnValue(of(deleteGWCfrmCSsyncRes));
    gwcServiceMock.deleteGWCfrmCSsync_v2.and.returnValue(of(deleteGWCfrmCSsync_v2Res));
    authServiceMock.getCLLI.and.returnValue(of(clliResponse));
    nvServiceMock.getAllGwc.and.returnValue(of(getAllGwcRes));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle closeDialog()', () => {
    component.showAssociateDialog = false;

    component.closeDialog();

    expect(component.showAssociateDialog).toBeFalse();
  });

  it('should handle onShowDialog()', () => {
    const event = 'dummy';

    component.showAssociateDialog = true;
    component.onShowDialog(event);

    expect(component.showAssociateDialog).toBeTrue();
  });

  it('should handle error and call showAPIError getGwcList', () => {
    const errorMessage = 'Error';
    gwcServiceMock.getGwcList.and.returnValue(throwError(errorMessage));

    component.isInprocess = false;
    component.ngOnInit();

    expect(gwcServiceMock.getGwcList).toHaveBeenCalled();
    expect(commonServiceMock.showAPIError).toHaveBeenCalledWith(errorMessage);
    expect(component.isInprocess).toBeFalse();
  });

  it('should set showDisassociateDialog to true when the selected menu item is disassociateGW', () => {
    const event = { title: 'disassociateGW' };

    component.handleSelectedMenuItem(event);

    expect(component.showDisassociateDialog).toBe(true);
  });

  it('should set showDeleteNodeDialog to true when the selected menu item is showDeleteNodeDialog', () => {
    spyOn(component,'getAllGwc');
    const event = { title: 'deleteGwcNode' };

    component.handleSelectedMenuItem(event);

    expect(component.showDeleteNodeDialog).toBe(true);
  });

  it('should submit the form, call the service, and handle the response', fakeAsync(() => {
    const gwName = 'GWC-0';
    const mockResponse = {
      rc: { __value: 0 } // Example response with rc value 0
    };

    gwcServiceMock.deleteDisAssocMGsync.and.returnValue(of(mockResponse));

    component.disassociateForm.get('gwName')?.setValue(gwName);
    component.onDisassociateFormSubmit(true);
    tick();

    expect(component.isInprocess).toBe(false);
    expect(component.confirmDisassociate.title).toEqual(
      component.translateResults.GATEWAY_CONTROLLERS.DISASSOCIATE.CONFIRM_TITLE
    );
    expect(component.confirmDisassociate.titleAccept).toEqual(
      component.translateResults.COMMON.YES
    );
    expect(component.confirmDisassociate.titleReject).toEqual(
      component.translateResults.COMMON.NO
    );
    expect(component.confirmDisassociate.content).toContain(gwName);
    expect(component.confirmDisassociate.isShowConfirmDialog).toBe(true);

    // Call the accept handler
    component.confirmDisassociate.handleAccept(true);
    tick();

    // Check if the success message is displayed based on the response code
    expect(commonServiceMock.showSuccessMessage).toHaveBeenCalledWith(
      component.translateResults.GATEWAY_CONTROLLERS.DISASSOCIATE.CONFIRM_MSG
        .CODE_0
    );
    expect(component.confirmDisassociate.isShowConfirmDialog).toBe(false);
  }));

  // it('should submit the form, call the service, and handle the response', fakeAsync(() => {
  //   const gwName = 'GWC-0';
  //   const mockResponse = {
  //     rc: { __value: 26 } // Example response with rc value 26
  //   };

  //   gwcServiceMock.deleteDisAssocMGsync.and.returnValue(of(mockResponse));

  //   component.disassociateForm.get('gwName')?.setValue(gwName);
  //   component.onDisassociateFormSubmit(true);
  //   tick();

  //   expect(component.isInprocess).toBe(false);
  //   expect(component.confirmDisassociate.title).toEqual(
  //     component.translateResults.GATEWAY_CONTROLLERS.DISASSOCIATE.CONFIRM_TITLE
  //   );
  //   expect(component.confirmDisassociate.titleAccept).toEqual(
  //     component.translateResults.COMMON.YES
  //   );
  //   expect(component.confirmDisassociate.titleReject).toEqual(
  //     component.translateResults.COMMON.NO
  //   );
  //   expect(component.confirmDisassociate.content).toContain(gwName);
  //   expect(component.confirmDisassociate.isShowConfirmDialog).toBe(true);

  //   // Call the accept handler
  //   component.confirmDisassociate.handleAccept(true);
  //   tick();

  //   // Check if the success message is displayed based on the response code
  //   expect(commonServiceMock.showErrorMessage).toHaveBeenCalledWith(
  //     component.translateResults.GATEWAY_CONTROLLERS.DISASSOCIATE.CONFIRM_MSG
  //       .CODE_26
  //   );
  //   expect(component.confirmDisassociate.isShowConfirmDialog).toBe(false);
  // }));

  // it('should submit the form, call the service, and handle the response', fakeAsync(() => {
  //   const gwName = 'GWC-0';
  //   const mockResponse = {
  //     rc: { __value: 31 } // Example response with rc value 31
  //   };

  //   gwcServiceMock.deleteDisAssocMGsync.and.returnValue(of(mockResponse));

  //   component.disassociateForm.get('gwName')?.setValue(gwName);
  //   component.onDisassociateFormSubmit(true);
  //   tick();

  //   expect(component.isInprocess).toBe(false);
  //   expect(component.confirmDisassociate.title).toEqual(
  //     component.translateResults.GATEWAY_CONTROLLERS.DISASSOCIATE.CONFIRM_TITLE
  //   );
  //   expect(component.confirmDisassociate.titleAccept).toEqual(
  //     component.translateResults.COMMON.YES
  //   );
  //   expect(component.confirmDisassociate.titleReject).toEqual(
  //     component.translateResults.COMMON.NO
  //   );
  //   expect(component.confirmDisassociate.content).toContain(gwName);
  //   expect(component.confirmDisassociate.isShowConfirmDialog).toBe(true);

  //   // Call the accept handler
  //   component.confirmDisassociate.handleAccept(true);
  //   tick();

  //   // Check if the success message is displayed based on the response code
  //   expect(commonServiceMock.showErrorMessage).toHaveBeenCalledWith(
  //     component.translateResults.GATEWAY_CONTROLLERS.DISASSOCIATE.CONFIRM_MSG
  //       .CODE_31
  //   );
  //   expect(component.confirmDisassociate.isShowConfirmDialog).toBe(false);
  // }));

  it('should submit the form, call the service, and handle the response', fakeAsync(() => {
    const gwName = 'GWC-0';
    const mockResponse = {
      rc: { __value: 4 },
      responseMsg:'Invalid Input' // Example response with rc value others
    };

    gwcServiceMock.deleteDisAssocMGsync.and.returnValue(of(mockResponse));

    component.disassociateForm.get('gwName')?.setValue(gwName);
    component.onDisassociateFormSubmit(true);
    tick();

    expect(component.isInprocess).toBe(false);
    expect(component.confirmDisassociate.title).toEqual(
      component.translateResults.GATEWAY_CONTROLLERS.DISASSOCIATE.CONFIRM_TITLE
    );
    expect(component.confirmDisassociate.titleAccept).toEqual(
      component.translateResults.COMMON.YES
    );
    expect(component.confirmDisassociate.titleReject).toEqual(
      component.translateResults.COMMON.NO
    );
    expect(component.confirmDisassociate.content).toContain(gwName);
    expect(component.confirmDisassociate.isShowConfirmDialog).toBe(true);

    // Call the accept handler
    component.confirmDisassociate.handleAccept(true);
    tick();

    // Check if the success message is displayed based on the response code
    expect(component.detailsText).toBe(mockResponse.responseMsg);
    expect(component.confirmDisassociate.isShowConfirmDialog).toBe(false);
  }));

  it('should submit the form, call the service, and handle the response', fakeAsync(() => {
    const gwName = 'GWC-0';
    const mockResponse = {
      rc: { __value: 4 },
      responseMsg:'' // Example response with rc value others
    };

    gwcServiceMock.deleteDisAssocMGsync.and.returnValue(of(mockResponse));

    component.disassociateForm.get('gwName')?.setValue(gwName);
    component.onDisassociateFormSubmit(true);
    tick();

    expect(component.isInprocess).toBe(false);
    expect(component.confirmDisassociate.title).toEqual(
      component.translateResults.GATEWAY_CONTROLLERS.DISASSOCIATE.CONFIRM_TITLE
    );
    expect(component.confirmDisassociate.titleAccept).toEqual(
      component.translateResults.COMMON.YES
    );
    expect(component.confirmDisassociate.titleReject).toEqual(
      component.translateResults.COMMON.NO
    );
    expect(component.confirmDisassociate.content).toContain(gwName);
    expect(component.confirmDisassociate.isShowConfirmDialog).toBe(true);

    // Call the accept handler
    component.confirmDisassociate.handleAccept(true);
    tick();

    // Check if the success message is displayed based on the response code
    expect(component.detailsText).toBe(component.translateResults.GATEWAY_CONTROLLERS.DISASSOCIATE.CONFIRM_MSG.CODE_UNKNOWN);
    expect(component.confirmDisassociate.isShowConfirmDialog).toBe(false);
  }));

  it('should submit the form, call the service, and handle the response', fakeAsync(() => {
    const gwName = 'GWC-0';
    const mockResponse = {
      rc: { __value: 31 } // Example response with rc value 31
    };

    gwcServiceMock.deleteDisAssocMGsync.and.returnValue(of(mockResponse));

    component.disassociateForm.get('gwName')?.setValue(gwName);
    component.onDisassociateFormSubmit(true);
    tick();

    expect(component.isInprocess).toBe(false);
    expect(component.confirmDisassociate.title).toEqual(
      component.translateResults.GATEWAY_CONTROLLERS.DISASSOCIATE.CONFIRM_TITLE
    );
    expect(component.confirmDisassociate.titleAccept).toEqual(
      component.translateResults.COMMON.YES
    );
    expect(component.confirmDisassociate.titleReject).toEqual(
      component.translateResults.COMMON.NO
    );
    expect(component.confirmDisassociate.content).toContain(gwName);
    expect(component.confirmDisassociate.isShowConfirmDialog).toBe(true);

    // Call the accept handler
    component.confirmDisassociate.handleAccept(false);
    tick();

    expect(component.confirmDisassociate.isShowConfirmDialog).toBe(false);
  }));

  it('should cancel the form submission and reset the form', fakeAsync(() => {
    component.onDisassociateFormSubmit(false);
    tick();

    expect(component.showDisassociateDialog).toBe(false);
    expect(component.disassociateForm.get('gwName')?.value).toBeNull();
  }));

  it('should return flowthrough status observable', () => {
    const profileName = 'testProfile';

    let result: any;

    component.getFlowthroughStatus(profileName);

    gwcServiceMock.getFlowthroughStatus(profileName).subscribe((status: any) => {
      result = status;
    });

    expect(gwcServiceMock.getFlowthroughStatus).toHaveBeenCalledWith(profileName);
    expect(result).toEqual(flowThroughTrue);
  });

  it('should handle error and call showAPIError getUnitStatus', () => {
    const errorMessage = 'Error';
    const item = 'GWC-0';
    gwcServiceMock.getUnitStatus.and.returnValue(throwError(errorMessage));

    component.isInprocess = false;
    component.handleChangeGwcem(item);

    expect(component.currentGwControllerName).toBe(item);
    expect(gwcServiceMock.getUnitStatus).toHaveBeenCalledWith(item);
    expect(commonServiceMock.showAPIError).toHaveBeenCalledWith(errorMessage);
    expect(component.isInprocess).toBeFalse();
  });

  it('should handle error and call showAPIError getAllGwc', () => {
    const errorMessage = 'Error';
    nvServiceMock.getAllGwc.and.returnValue(throwError(errorMessage));

    component.isInprocess = false;
    component.ngOnInit();

    expect(nvServiceMock.getAllGwc).toHaveBeenCalled();
    expect(commonServiceMock.showAPIError).toHaveBeenCalledWith(errorMessage);
    expect(component.isInprocess).toBeFalse();
  });

  it('should submit the form, call the service, and handle the response', fakeAsync(() => {
    const selectedGw = 'GWC-0';
    const gwName='GWC-0';
    component.deleteGwcNodeForm.get('gwcName')?.setValue(selectedGw);
    const status = true;
    spyOn(component, 'getFlowthroughStatus').and.returnValue(of(status));
    const mockResponse = {
      rc: { __value: 0 } // Success response with rc value 0
    };

    gwcServiceMock.deleteDisAssocMGsync.and.returnValue(of(mockResponse));
    component.onDeleteGwcNodeFormSubmit(true);
    tick();

    expect(component.isInprocess).toBe(false);
    expect(component.confirmDeleteGwcNode.title).toEqual(
      component.translateResults.GATEWAY_CONTROLLERS.DELETE_GWC_NODE.CONFIRM_TITLE
    );
    expect(component.confirmDeleteGwcNode.titleAccept).toEqual(
      component.translateResults.COMMON.YES
    );
    expect(component.confirmDeleteGwcNode.titleReject).toEqual(
      component.translateResults.COMMON.NO
    );
    expect(component.confirmDeleteGwcNode.content).toContain(gwName);
    expect(component.confirmDeleteGwcNode.isShowConfirmDialog).toBe(true);

    // Call the accept handler
    component.confirmDeleteGwcNode.handleAccept(true);
    tick();

    expect(component.confirmDeleteGwcNode.isShowConfirmDialog).toBe(false);


    expect(component.isInprocess).toBe(false);
  }));

  it('should submit the form, call the service, and handle the fail rc value', fakeAsync(() => {
    const selectedGw = 'GWC-0';
    const gwName='GWC-0';
    component.deleteGwcNodeForm.get('gwcName')?.setValue(selectedGw);
    const status = true;
    spyOn(component, 'getFlowthroughStatus').and.returnValue(of(status));
    const mockResponse = {
      rc: { __value: 4 } // Success response with rc value 4
    };

    gwcServiceMock.deleteGWCfrmCSsync_v2.and.returnValue(of(mockResponse));
    component.onDeleteGwcNodeFormSubmit(true);
    tick();

    expect(component.isInprocess).toBe(false);
    expect(component.confirmDeleteGwcNode.title).toEqual(
      component.translateResults.GATEWAY_CONTROLLERS.DELETE_GWC_NODE.CONFIRM_TITLE
    );
    expect(component.confirmDeleteGwcNode.titleAccept).toEqual(
      component.translateResults.COMMON.YES
    );
    expect(component.confirmDeleteGwcNode.titleReject).toEqual(
      component.translateResults.COMMON.NO
    );
    expect(component.confirmDeleteGwcNode.content).toContain(gwName);
    expect(component.confirmDeleteGwcNode.isShowConfirmDialog).toBe(true);

    // Call the accept handler
    component.confirmDeleteGwcNode.handleAccept(true);
    tick();

    expect(component.confirmDeleteGwcNode.isShowConfirmDialog).toBe(false);

    expect(component.isInprocess).toBe(false);
  }));

  it('should submit the form, call the service, and handle the false status', fakeAsync(() => {
    const selectedGw = 'GWC-0';
    const gwName='GWC-0';
    component.deleteGwcNodeForm.get('gwcName')?.setValue(selectedGw);
    const status = false;
    spyOn(component, 'getFlowthroughStatus').and.returnValue(of(status));
    const mockResponse = {
      rc: { __value: 0 } // Success response with rc value 4
    };

    gwcServiceMock.deleteGWCfrmCSsync_v2.and.returnValue(of(mockResponse));
    component.onDeleteGwcNodeFormSubmit(true);
    tick();

    expect(component.isInprocess).toBe(false);
    expect(component.confirmDeleteGwcNode.title).toEqual(
      component.translateResults.GATEWAY_CONTROLLERS.DELETE_GWC_NODE.CONFIRM_TITLE
    );
    expect(component.confirmDeleteGwcNode.titleAccept).toEqual(
      component.translateResults.COMMON.YES
    );
    expect(component.confirmDeleteGwcNode.titleReject).toEqual(
      component.translateResults.COMMON.NO
    );
    expect(component.confirmDeleteGwcNode.content).toContain(gwName);
    expect(component.confirmDeleteGwcNode.isShowConfirmDialog).toBe(true);

    // Call the accept handler
    component.confirmDeleteGwcNode.handleAccept(true);
    tick();

    expect(component.confirmDeleteGwcNode.isShowConfirmDialog).toBe(false);

    expect(component.isInprocess).toBe(false);
  }));

  it('should close error dialog and show details button', () => {
    component.closeErrorDialog();
    expect(component.showErrorDialog).toBeFalse();
    expect(component.showDetailsBtn).toBeTrue();
  });

  it('should toggle showDetailsBtn property', () => {
    component.showOrHideButtonClick();
    expect(component.showDetailsBtn).toBeFalse();
    component.showOrHideButtonClick();
    expect(component.showDetailsBtn).toBeTrue();
  });

  it('should toggle showGwcDetailsBtn property', () => {
    component.showGwcDetailsBtn=true;
    component.showOrHideGwcButtonClick();
    expect(component.showGwcDetailsBtn).toBeFalse();
    component.showOrHideGwcButtonClick();
    expect(component.showGwcDetailsBtn).toBeTrue();
  });

  it('should handle closeGwcErrorDialog', () => {
    component.closeGwcErrorDialog();
    expect(component.messageTextGwc).toEqual('');
    expect(component.detailsTextGwc).toEqual('');
    expect(component.showGwcErrorDialog).toBeFalse();
    expect(component.showGwcDetailsBtn).toBeTrue();
  });

  it('should toggle open add new gwc dialog', () => {
    component.onShowAddGwcNode();
    expect(component.isShowNewGWCNodeDialog).toBeTrue();
  });

  it('should close add new gwc dialog', () => {
    component.closeNewGWCNodeDialog();
    expect(component.isShowNewGWCNodeDialog).toBeFalse();
  });

  it('should close Associate Dialog', () => {
    component.closeAssociateDialog();
    expect(component.showAssociateDialog).toBeFalse();
  });
});
