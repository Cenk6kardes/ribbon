import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterfaceInputsComponent } from './interface-inputs.component';
import { AppModule } from 'src/app/app.module';
import { TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA, SimpleChange, SimpleChanges } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { TranslateInternalService } from 'src/app/services/translate-internal.service';
import { InterfaceBrowserService } from '../../../services/interface-browser.service';
import { of, throwError } from 'rxjs';

describe('InterfaceInputsComponent', () => {
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
          ADD_NEW_INTERFACE: 'Add New Interface'
        },
        V5_RING_VIEW: {
          FIELD_LABEL: {
            SUCCESS: 'Template {{action}} successfully.'
          },
          ADD_CONFIRM: {
            TITLE: 'Adding V5.2 Interface',
            CONTENT: 'Adding V5.2 Interface: a confirmation dialog will appear once the operation' +
            ' is complete.<br>Click OK to proceed with the operation.'
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

  const interfaceItem = {
    siteGwcLoc: 'V52    04 0',
    gwcId: '2',
    v52InterfaceId: '102',
    linkMapTable: [
      {
        linkId: '1',
        epGrp: 'testv52gw1.TDMs16c1f1/1/1/1'
      },
      {
        linkId: '2',
        epGrp: 'testv52gw1.TDMs16c1f1/1/1/3'
      }
    ],
    maxlinesSelector: 'REG',
    maxlines: '120',
    v5ProvRef: '1',
    v5SigTableRef: 'PVGDEF',
    v5RingTableRef: 'DEFAULT'
  };

  const addInterfaceResponse = {
    operation: {
      __value: 0
    },
    rc: {
      __value: 0
    },
    responseMsg: 'Add Interface operation was successful',
    responseData: {
      ___v52Interface: null,
      ___v5Prov: null,
      ___v5Sig: null,
      ___v5Ring: null,
      ___key_list: null,
      ___carrier_list: null,
      ___no_data: 'No Data',
      __discriminator: {
        __value: 0
      },
      __uninitialized: false
    }
  };
  const getInterfaceTemplateResponse = {
    operation: {
      __value: 3
    },
    rc: {
      __value: 0
    },
    responseMsg: 'List Interface operation was successful',
    responseData: {
      ___v52Interface: {
        siteGwcLoc: 'V52    04 0',
        gwcId: '2',
        v52InterfaceId: '102',
        linkMapTable: [
          {
            linkId: '1',
            epGrp: 'testv52gw1.TDMs16c1f1/1/1/1'
          },
          {
            linkId: '2',
            epGrp: 'testv52gw1.TDMs16c1f1/1/1/3'
          }
        ],
        maxlinesSelector: 'REG',
        maxlines: '120',
        v5ProvRef: '1',
        v5SigTableRef: 'TST',
        v5RingTableRef: 'DEFAULT'
      },
      ___v5Prov: null,
      ___v5Sig: null,
      ___v5Ring: null,
      ___key_list: null,
      ___carrier_list: null,
      ___no_data: null,
      __discriminator: {
        __value: 1
      },
      __uninitialized: false
    }
  };

  const modifyInterfaceResponse = {
    operation: {
      __value: 2
    },
    rc: {
      __value: 0
    },
    responseMsg: 'Modify Interface operation was successful',
    responseData: {
      ___v52Interface: null,
      ___v5Prov: null,
      ___v5Sig: null,
      ___v5Ring: null,
      ___key_list: null,
      ___carrier_list: null,
      ___no_data: 'No Data',
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
      'getInterfaceBrowserTemplate',
      'addNewInterfaceBrowser',
      'modifyInterfaceBrowser'
    ]
  );
  let component: InterfaceInputsComponent;
  let fixture: ComponentFixture<InterfaceInputsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InterfaceInputsComponent],
      imports: [AppModule, TranslateModule.forRoot()],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: CommonService, useValue: commonService },
        { provide: TranslateInternalService, useValue: translate },
        { provide: InterfaceBrowserService, useValue: interfaceBrowserService }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(InterfaceInputsComponent);
    component = fixture.componentInstance;
    interfaceBrowserService.getInterfaceBrowserTemplate.and.returnValue(
      of(getInterfaceTemplateResponse)
    );
    interfaceBrowserService.addNewInterfaceBrowser.and.returnValue(
      of(addInterfaceResponse)
    );
    interfaceBrowserService.modifyInterfaceBrowser.and.returnValue(
      of(modifyInterfaceResponse)
    );
    component.options={
      maxlinesSelector: [],
      ringIds: [],
      provIds: [],
      sigIds: [],
      interfaceBrowserIds: []
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should should call getInterfaceBrowserTemplate method', () => {
    component.getInterfaceTemplate('102');
    expect(
      interfaceBrowserService.getInterfaceBrowserTemplate
    ).toHaveBeenCalledWith('102');
  });

  it('should show api error if getInterfaceRequest throws error', () => {
    interfaceBrowserService.getInterfaceBrowserTemplate.and.returnValue(
      throwError('error')
    );
    component.getInterfaceTemplate('102');
    expect(commonService.showAPIError).toHaveBeenCalled();
  });

  it('should emit an event with the event target id', () => {
    let emittedValue: string | undefined;
    const fakeEvent = { target: { id: 'exampleId' } };

    component.fetchEmitter.subscribe((value) => {
      emittedValue = value;
    });

    component.fetch(fakeEvent);

    expect(emittedValue).toBe('exampleId');
  });

  it('should modify interfacebrowser if not isAddinterface', () => {
    spyOn(component, 'modifyInterface');
    component.isAddInterface = false;
    component.onFormSubmit(true);
    expect(component.modifyInterface).toHaveBeenCalled();
  });

  it('should add interfacebrowser if isAddinterface', () => {
    spyOn(component, 'addInterface');
    spyOn(component, 'closeConfirmDialog');
    component.isAddInterface = true;
    component.onFormSubmit(true);
    component.confirmAddInterface.handleAccept(true);

    expect(component.addInterface).toHaveBeenCalled();
    expect(component.closeConfirmDialog).toHaveBeenCalled();
  });

  it('should add interfacebrowser if isAddinterface and confirm cancel', () => {
    spyOn(component, 'closeConfirmDialog');
    component.isAddInterface = true;
    component.onFormSubmit(true);
    component.confirmAddInterface.handleAccept(false);

    expect(component.closeConfirmDialog).toHaveBeenCalled();
  });

  it('should closeConfirmDialog', () => {
    component.closeConfirmDialog();

    expect(component.confirmAddInterface.isShowConfirmDialog).toBeFalse();
    expect(component.confirmAddInterface.title).toEqual('');
    expect(component.confirmAddInterface.titleAccept).toEqual('');
    expect(component.confirmAddInterface.titleReject).toEqual('');
    expect(component.confirmAddInterface.content).toEqual('');
  });

  it('should call addinterface method from service', () => {
    spyOn(component,'closeDialog');
    component.addInterface(interfaceItem);
    expect(interfaceBrowserService.addNewInterfaceBrowser).toHaveBeenCalledWith(
      interfaceItem
    );
  });

  it('should show error message on failed request addinterface', () => {
    interfaceBrowserService.addNewInterfaceBrowser.and.returnValue(
      throwError('error')
    );

    component.addInterface(interfaceItem);
    expect(commonService.showAPIError).toHaveBeenCalled();
  });

  it('should modify interface', () => {
    spyOn(component,'getInterfaceTemplate');
    spyOn(component,'closeDialog');
    component.identifier = '1';
    component.modifyInterface(interfaceItem, true);
    expect(interfaceBrowserService.modifyInterfaceBrowser).toHaveBeenCalled();
  });

  it('should modify should get default values on cancel', () => {
    spyOn(component,'getInterfaceTemplate');
    component.identifier = '1';
    component.modifyInterface(interfaceItem, false);
    expect(component.getInterfaceTemplate).toHaveBeenCalled();
  });

  it('should modify show api error on error', () => {
    interfaceBrowserService.modifyInterfaceBrowser.and.returnValue(throwError('err'));
    component.identifier = '1';
    component.modifyInterface(interfaceItem, true);
    expect(commonService.showAPIError).toHaveBeenCalled();
  });

  it('should modify interface successfull request but validation error ', () => {
    const modifyInterfaceResponsewithError = {
      operation: {
        __value: 2
      },
      rc: {
        __value: 3
      },
      responseMsg: 'Modify Interface operation was successful',
      responseData: {
        ___v52Interface: null,
        ___v5Prov: null,
        ___v5Sig: null,
        ___v5Ring: null,
        ___key_list: null,
        ___carrier_list: null,
        ___no_data: 'No Data',
        __discriminator: {
          __value: 0
        },
        __uninitialized: false
      }
    };
    interfaceBrowserService.modifyInterfaceBrowser.and.returnValue(
      of(modifyInterfaceResponsewithError)
    );
    component.identifier = '1';
    component.modifyInterface(interfaceItem, true);
    expect(commonService.showErrorMessage).toHaveBeenCalled();
  });

  it('should add interface throw error popup on successfull request but validation error ', () => {
    const addInterfaceResponseError = {
      operation: {
        __value: 0
      },
      rc: {
        __value: 3
      },
      responseMsg: 'Add Interface operation was successful',
      responseData: {
        ___v52Interface: null,
        ___v5Prov: null,
        ___v5Sig: null,
        ___v5Ring: null,
        ___key_list: null,
        ___carrier_list: null,
        ___no_data: 'No Data',
        __discriminator: {
          __value: 0
        },
        __uninitialized: false
      }
    };
    interfaceBrowserService.addNewInterfaceBrowser.and.returnValue(
      of(addInterfaceResponseError)
    );
    component.addInterface(interfaceItem);
    expect(commonService.showErrorMessage).toHaveBeenCalled();
  });

  it('should go back to default values on cancel', () => {
    spyOn(component, 'closeDialog');
    component.isAddInterface = true;
    component.onFormSubmit(false);
    expect(component.closeDialog).toHaveBeenCalled();
  });

  it('should emit closeDialogEmitter with the correct parameter', () => {
    spyOn(component.closeDialogEmitter, 'emit');
    const isChangedValue = true;
    component.closeDialog(isChangedValue);
    expect(component.closeDialogEmitter.emit).toHaveBeenCalledWith(isChangedValue);
  });

  it('should not call getInterfaceTemplate when isAddInterface is true', () => {
    const mockIdentifier = 'Default';
    component.isAddInterface=false;
    component.identifier=mockIdentifier;
    const mockChanges: SimpleChanges = {
      identifier: new SimpleChange(undefined, mockIdentifier, true),
      isAddInterface: new SimpleChange(undefined, true, true)
    };
    spyOn(component, 'getInterfaceTemplate');
    component.ngOnChanges(mockChanges);
    expect(component.identifier).toEqual(mockIdentifier);
    expect(component.getInterfaceTemplate).toHaveBeenCalled();
  });
});
