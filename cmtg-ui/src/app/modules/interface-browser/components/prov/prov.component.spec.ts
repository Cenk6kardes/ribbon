import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvComponent } from './prov.component';
import { AppModule } from 'src/app/app.module';
import { TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { TranslateInternalService } from 'src/app/services/translate-internal.service';
import { InterfaceBrowserService } from '../../services/interface-browser.service';
import { of, throwError } from 'rxjs';

describe('ProvComponent', () => {
  const translate = {
    translateResults: {
      COMMON: {
        DELETE: 'Delete',
        EDIT: 'Edit',
        OK: 'OK',
        CLOSE: 'Close',
        BULK_ACTIONS: 'Bulk Action',
        ACTION: 'Action',
        RUN: 'Run',
        POST_COMMAND_LABEL: 'Post',
        CANCEL: 'Cancel',
        SAVE: 'Save',
        ERROR: 'Error',
        ADD: 'Add',
        YES: 'Yes',
        NO: 'No',
        FORM_NOT_VALID: 'Form not valid',
        SELECT: 'Select',
        RESET: 'Reset',
        NOT_CONFIGURED: 'Not Configured',
        ACTION_FAILED: 'Action Failed!',
        SHOW_DETAILS: 'Show Details',
        HIDE_DETAILS: 'Hide Details',
        ENABLED: 'Enabled',
        DISABLED: 'Disabled',
        INPUT: 'Input',
        SEARCH: 'Search'
      },
      INTERFACE_BROWSER: {
        V5_RING_VIEW: {
          TITLE: 'V5 Ring View',
          HEADER: {
            ADD_NEW_V5RING: 'Add New V5Ring',
            DELETE_IDENTIFIER: 'Delete Identifier'
          },
          FIELD_LABEL: {
            NEW_V5_RING: 'New V5Ring',
            STD: 'STD',
            Select_DELETE_IDENTIFIER: 'Select the identifier to delete',
            IDENTIFIER: 'Identifier',
            SUCCESS: 'Template {{action}} successfully.'
          },
          ERROR_MESSAGES: {
            IDENTIFIER_REQUIRED: 'Identifier Required'
          }
        },
        PROV: {
          TITLE: 'V5 Prov View',
          HEADER: {
            ADD_NEW_PROV: 'New V5PROV',
            VALUES: 'Values',
            PROT2_CONFIGURATION: 'PROT2 Configuration',
            CCHNL: 'Cchnl Configuration'
          },
          FIELD_LABEL: {
            TBCC: 'TBCC',
            LKMJALM: 'LKMJALM',
            PROT1: 'PROT1',
            PROT2_LINK: 'Prot2 Link',
            PROT2_CHANNEL: 'Prot2 Channel',
            PROT2_LIST: 'PROT2 List',
            CCHNL_ID: 'CCHNL ID',
            LINK: 'LINK',
            CHANNEL: 'CHANNEL',
            CPATH: 'CPATH',
            CCHNL_ENTRIES: 'CCHNL ENTRIES',
            ARE_U_SURE: 'Are you sure ? ',
            DELETE_PROT2: 'Do you really want to remove this PROT2 entry?',
            DELETE_CCHNL: 'Do you really want to remove this CChnl entry?'
          },
          TOOLTIP: {
            DELETE_PROT2: 'Delete Prot2',
            DELETE_CCHNL: 'Delete CCHNL',
            ADD_PROT2: 'Add Prot2',
            ERASE_INPUTS: 'Erase Inputs'
          },
          ERROR_MESSAGES: {
            PROT2CHANNEL_REQUIRED: 'No channel information',
            PROT2LINK_REQUIRED: 'No link information',
            CCHNLID_REQUIRED: 'No CCHNLID information',
            CHANNEL_REQUIRED: 'No channel information',
            LINK_REQUIRED: 'No link information',
            CPATH_REQUIRED: 'You must select at least one CPATH',
            TBCC_REQUIRED: 'No TBCC information',
            LKMJALM_REQUIRED: 'No LKMJALM information',
            PRO1_REQUIRED: 'No PROT1 information'
          }
        }
      }
    }
  };

  const getProvIDsResponse = {
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
      ___key_list: ['1', '2', '9', '10'],
      ___carrier_list: null,
      ___no_data: null,
      __discriminator: {
        __value: 5
      },
      __uninitialized: false
    }
  };
  const deleteProvResponse = {
    operation: {
      __value: 6
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
      ___key_list: null,
      ___carrier_list: null,
      ___no_data: '11',
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
    ['deleteProv', 'getProvTemplateId']
  );

  let component: ProvComponent;
  let fixture: ComponentFixture<ProvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProvComponent],
      imports: [AppModule, TranslateModule.forRoot()],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: CommonService, useValue: commonService },
        { provide: TranslateInternalService, useValue: translate },
        { provide: InterfaceBrowserService, useValue: interfaceBrowserService }
      ]
    }).compileComponents();

    interfaceBrowserService.getProvTemplateId.and.returnValue(
      of(getProvIDsResponse)
    );

    interfaceBrowserService.deleteProv.and.returnValue(of(deleteProvResponse));

    fixture = TestBed.createComponent(ProvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set isShowAddProv and isShowDeleteProv to false', () => {
    component.closeDialog();
    expect(component.isShowAddProv).toBeFalsy();
    expect(component.isShowDeleteProv).toBeFalsy();
  });

  it('should delete selected identifier', () => {
    component.selectedIdentifierToDelete = '2';
    component.deleteSelectedIdentifier(true);
    expect(interfaceBrowserService.deleteProv).toHaveBeenCalled();
  });

  it('should delete throw error', () => {
    interfaceBrowserService.deleteProv.and.returnValue(throwError('error'));
    component.selectedIdentifierToDelete = '2';
    component.deleteSelectedIdentifier(true);
    expect(commonService.showAPIError).toHaveBeenCalled();
  });

  it('should delete response has wrong rc show error', () => {
    const ddeleteProvResponse = {
      operation: {
        __value: 6
      },
      rc: {
        __value: 3
      },
      responseMsg: 'Table operation was successful',
      responseData: {
        ___v52Interface: null,
        ___v5Prov: null,
        ___v5Sig: null,
        ___v5Ring: null,
        ___key_list: null,
        ___carrier_list: null,
        ___no_data: '11',
        __discriminator: {
          __value: 0
        },
        __uninitialized: false
      }
    };
    interfaceBrowserService.deleteProv.and.returnValue(of(ddeleteProvResponse));
    component.selectedIdentifierToDelete = '2';
    component.deleteSelectedIdentifier(true);
    expect(commonService.showErrorMessage).toHaveBeenCalled();
  });

  it('should call showErrorMessage when getProvIDs returns an error', () => {
    interfaceBrowserService.getProvTemplateId.and.returnValue(throwError('error'));
    component.getProvIDs();
    expect(commonService.showAPIError).toHaveBeenCalled();
  });
});
