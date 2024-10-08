import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterfaceBrowserComponent } from './interface-browser.component';
import { AppModule } from 'src/app/app.module';
import { TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { TranslateInternalService } from 'src/app/services/translate-internal.service';
import { InterfaceBrowserService } from '../../services/interface-browser.service';
import { of, throwError } from 'rxjs';

describe('InterfaceBrowserComponent', () => {
  const translate = {
    translateResults: {
      INTERFACE_BROWSER: {
        TITLE: 'V5.2 Interface Browser',
        HEADER: {
          INTERFACE_LOCATION: 'Interface Location',
          TEMPLATES: 'Templates',
          MAX_LINES: 'Max Lines',
          LINK_MAPPING: 'Link Mapping'
        },
        FIELD_LABEL: {
          INTERFACE_ID: 'Interface ID',
          GATEWAY_CONTROLLER_ID: 'Gateway Controller ID',
          AMCNO: 'AMCNO',
          V5PROV: 'V5PROV',
          V5RING: 'V5RING',
          V5SIG: 'V5SIG',
          MAXLINES_SELECTOR: 'Maxlines Selector',
          MAXLINE_VALUE: 'Maxline Value',
          SELECT_INTERFACE: 'Select a V5.2 Interface',
          DELETE_INTERFACE: 'Delete Interface',
          NEW_INTERFACE: 'New Interface',
          ADD_NEW_INTERFACE: 'Add New Interface',
          ARE_YOU_SURE_TO_DELETE:''
        },
        V5_RING_VIEW: {
          FIELD_LABEL: {
            SUCCESS: 'Template {{action}} successfully.'
          }
        }
      },
      COMMON: {
        DELETE: 'Delete',
        OK: 'OK',
        CLOSE: 'Close',
        BULK_ACTIONS: 'Bulk Action',
        ACTION: 'Action',
        RUN: 'Run',
        POST_COMMAND_LABEL: 'Post',
        CANCEL: 'Cancel',
        ERROR: 'Error',
        ADD: 'Add',
        YES: 'Yes',
        NO: 'No',
        SAVE: 'Save',
        SELECT: 'Select'
      }
    }
  };

  const getSigIdResponse = {
    operation: {
      __value: 19
    },
    rc: {
      __value: 0
    },
    responseMsg: 'Table operation was successful',
    responseData: {
      ___v52Interface: null,
      ___v5Prov: null,
      ___v5Sig: null,
      ___v5Ring: null,
      ___key_list: ['DEFAULT', 'PVGDEF'],
      ___carrier_list: null,
      ___no_data: null,
      __discriminator: {
        __value: 5
      },
      __uninitialized: false
    }
  };

  const getRingIdResponse = {
    operation: {
      __value: 14
    },
    rc: {
      __value: 0
    },
    responseMsg: 'Table operation was successful',
    responseData: {
      ___v52Interface: null,
      ___v5Prov: null,
      ___v5Sig: null,
      ___v5Ring: null,
      ___key_list: ['DEFAULT', 'TEST33'],
      ___carrier_list: null,
      ___no_data: null,
      __discriminator: {
        __value: 5
      },
      __uninitialized: false
    }
  };

  const getInterfaceIdResponse = {
    operation: {
      __value: 4
    },
    rc: {
      __value: 0
    },
    responseMsg: 'List All Interface operation was successful',
    responseData: {
      ___v52Interface: null,
      ___v5Prov: null,
      ___v5Sig: null,
      ___v5Ring: null,
      ___key_list: ['102'],
      ___carrier_list: null,
      ___no_data: null,
      __discriminator: {
        __value: 5
      },
      __uninitialized: false
    }
  };

  const getProvIdResponse = {
    operation: {
      __value: 9
    },
    rc: {
      __value: 0
    },
    responseMsg: 'Table operation was successful',
    responseData: {
      ___v52Interface: null,
      ___v5Prov: null,
      ___v5Sig: null,
      ___v5Ring: null,
      ___key_list: ['1', '2', '9'],
      ___carrier_list: null,
      ___no_data: null,
      __discriminator: {
        __value: 5
      },
      __uninitialized: false
    }
  };

  const deleteInterfaceResponse = {
    operation: {
      __value: 1
    },
    rc: {
      __value: 0
    },
    responseMsg: 'Delete Interface operation was successful',
    responseData: {
      ___v52Interface: null,
      ___v5Prov: null,
      ___v5Sig: null,
      ___v5Ring: null,
      ___key_list: null,
      ___carrier_list: null,
      ___no_data: '102',
      __discriminator: {
        __value: 0
      },
      __uninitialized: false
    }
  };
  const commonService = jasmine.createSpyObj('commonService', [
    'showErrorMessage',
    'showAPIError',
    'showSuccessMessage'
  ]);

  const interfaceBrowserService = jasmine.createSpyObj(
    'interfaceBrowserService',
    [
      'getRingTemplateId',
      'getProvTemplateId',
      'getSigTemplateId',
      'getInterfaceBrowserTemplateID',
      'deleteInterfaceBrowser'
    ]
  );

  let component: InterfaceBrowserComponent;
  let fixture: ComponentFixture<InterfaceBrowserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InterfaceBrowserComponent],
      imports: [AppModule, TranslateModule.forRoot()],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: CommonService, useValue: commonService },
        { provide: TranslateInternalService, useValue: translate },
        { provide: InterfaceBrowserService, useValue: interfaceBrowserService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(InterfaceBrowserComponent);
    component = fixture.componentInstance;
    interfaceBrowserService.getRingTemplateId.and.returnValue(
      of(getRingIdResponse)
    );
    interfaceBrowserService.getProvTemplateId.and.returnValue(
      of(getProvIdResponse)
    );
    interfaceBrowserService.getSigTemplateId.and.returnValue(
      of(getSigIdResponse)
    );
    interfaceBrowserService.getInterfaceBrowserTemplateID.and.returnValue(
      of(getInterfaceIdResponse)
    );
    interfaceBrowserService.deleteInterfaceBrowser.and.returnValue(
      of(deleteInterfaceResponse)
    );
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open add interface dialog', () => {
    component.addInterface();
    expect(component.isShowAddInterface).toBe(true);
  });
  it('should open delete interface dialog', () => {
    component.deleteInterface();
    expect(component.isShowDeleteInterface).toBe(true);
  });

  it('should get interfaceBrowserIds if change happened after close dialog', () => {
    component.closeDialog(true);
    expect(
      interfaceBrowserService.getInterfaceBrowserTemplateID
    ).toHaveBeenCalled();
  });
  it('should show error message if error happens after close dialog request', () => {
    interfaceBrowserService.getInterfaceBrowserTemplateID.and.returnValue(
      throwError('error')
    );
    component.closeDialog(true);
    expect(component.isInprocess).toBe(false);
    expect(commonService.showAPIError).toHaveBeenCalled();
  });
  it('should fetchProv data and update provIds', () => {
    component.fetchDatas('fetchProv');
    expect(interfaceBrowserService.getProvTemplateId).toHaveBeenCalled();
    expect(component.options.provIds).toEqual(
      getProvIdResponse.responseData.___key_list
    );
  });
  it('should show error message if  provIds request has error', () => {
    interfaceBrowserService.getProvTemplateId.and.returnValue(
      throwError('error')
    );
    component.fetchDatas('fetchProv');
    expect(component.isInprocess).toBe(false);
    expect(commonService.showAPIError).toHaveBeenCalled();
  });

  it('should fetchRing data and update ringIds', () => {
    component.fetchDatas('fetchRing');
    expect(interfaceBrowserService.getRingTemplateId).toHaveBeenCalled();
    expect(component.options.ringIds).toEqual(
      getRingIdResponse.responseData.___key_list
    );
  });
  it('should show error message if  fetchRing request has error', () => {
    interfaceBrowserService.getRingTemplateId.and.returnValue(
      throwError('error')
    );
    component.fetchDatas('fetchRing');
    expect(component.isInprocess).toBe(false);
    expect(commonService.showAPIError).toHaveBeenCalled();
  });

  it('should fetchSig data and update sigIds', () => {
    component.fetchDatas('fetchSig');
    expect(interfaceBrowserService.getSigTemplateId).toHaveBeenCalled();
    expect(component.options.sigIds).toEqual(
      getSigIdResponse.responseData.___key_list
    );
  });
  it('should show error message if  fetchSig request has error', () => {
    interfaceBrowserService.getSigTemplateId.and.returnValue(
      throwError('error')
    );
    component.fetchDatas('fetchSig');
    expect(component.isInprocess).toBe(false);
    expect(commonService.showAPIError).toHaveBeenCalled();
  });

  it('should delete selected interfaceBrowser',()=>{
    component.deleteSelectedIdentifier(true);
    expect(interfaceBrowserService.deleteInterfaceBrowser).toHaveBeenCalled();
  });

  it('should opendeleteconfirm dialog', () => {
    component.selectedIdentifierToDelete='default';
    component.openDeleteConfirmDialog(false);
    component.openDeleteConfirmDialog(true);
    expect(component.isConfirmDeleteDialog).toBeTrue();
  });

  it('should deleteSelected identifier error and close dialog', () => {
    spyOn(component,'closeDialog');
    component.selectedIdentifierToDelete='default';
    component.deleteSelectedIdentifier(false);
    expect(component.closeDialog).toHaveBeenCalled();
    interfaceBrowserService.deleteInterfaceBrowser.and.returnValue(throwError('err'));
    component.deleteSelectedIdentifier(true);
    expect(commonService.showAPIError).toHaveBeenCalled();
  });

});
