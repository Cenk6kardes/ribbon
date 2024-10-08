import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvViewComponent } from './prov-view.component';
import { AppModule } from 'src/app/app.module';
import { TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA, SimpleChange, SimpleChanges } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { TranslateInternalService } from 'src/app/services/translate-internal.service';
import { InterfaceBrowserService } from '../../../services/interface-browser.service';
import { of, throwError } from 'rxjs';

describe('ProvViewComponent', () => {
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

  const getProvTemplateResponse = {
    operation: {
      __value: 8
    },
    rc: {
      __value: 0
    },
    responseMsg: 'Table operation was successful',
    responseData: {
      ___v52Interface: null,
      ___v5Prov: {
        v5provid: '9',
        bcctimer: '10',
        cchnlinflist: [
          {
            chnlid: '0',
            lcc: {
              lnk: '1',
              chnl: '16'
            },
            cpathlist: ['CTRL']
          }
        ],
        prot1: '2',
        prot2: [
          {
            lnk: '1',
            chnl: '15'
          }
        ],
        alarmthreshold: '50'
      },
      ___v5Sig: null,
      ___v5Ring: null,
      ___key_list: null,
      ___carrier_list: null,
      ___no_data: null,
      __discriminator: {
        __value: 2
      },
      __uninitialized: false
    }
  };

  const addProvTemplateResponse = {
    operation: {
      __value: 5
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
      ___no_data: 'No Data',
      __discriminator: {
        __value: 0
      },
      __uninitialized: false
    }
  };

  const modifyProvTemplateResponse = {
    operation: {
      __value: 7
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
      ___no_data: 'No data',
      __discriminator: {
        __value: 0
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
    ['getProvTemplate', 'deleteProv', 'addProvTemplate', 'modifyProvTemplate']
  );
  let component: ProvViewComponent;
  let fixture: ComponentFixture<ProvViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProvViewComponent],
      imports: [AppModule, TranslateModule.forRoot()],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: CommonService, useValue: commonService },
        { provide: TranslateInternalService, useValue: translate },
        { provide: InterfaceBrowserService, useValue: interfaceBrowserService }
      ]
    }).compileComponents();
    interfaceBrowserService.getProvTemplate.and.returnValue(
      of(getProvTemplateResponse)
    );
    interfaceBrowserService.addProvTemplate.and.returnValue(
      of(addProvTemplateResponse)
    );
    interfaceBrowserService.modifyProvTemplate.and.returnValue(
      of(modifyProvTemplateResponse)
    );
    interfaceBrowserService.deleteProv.and.returnValue(of(deleteProvResponse));

    fixture = TestBed.createComponent(ProvViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getProvTemplate and update form on changes', () => {
    spyOn(component, 'getProvTemplate');
    const changes: SimpleChanges = {
      identifier: new SimpleChange(null, 'identifier', true)
    };
    component.identifier = 'identifier';
    component.isAddProv = false;
    component.ngOnChanges(changes);
    expect(component.getProvTemplate).toHaveBeenCalledOnceWith('identifier');
    expect(component.form.get('identifier')?.value).toBe('identifier');
  });

  it('should get prov template and update form on success', () => {
    component.getProvTemplate('identifier');

    expect(component.cchnlEntriesOptions).toEqual([
      'id:0;link:1;channel:16;cpath:CTRL'
    ]);
    expect(component.prot2ListOptions).toEqual(['link:1;channel:15']);

    expect(component.form.value).toEqual({
      identifier: '9',
      tbcc: '10',
      lkmjalm: '50',
      prot1: '2',
      prot2List: 'link:1;channel:15',
      cchnlEntries: 'id:0;link:1;channel:16;cpath:CTRL'
    });
  });

  it('should show error message on API error', () => {
    interfaceBrowserService.getProvTemplate.and.returnValue(
      throwError('error')
    );

    component.getProvTemplate('someIdentifier');

    expect(component.isInprocess).toBe(false);
  });

  it('should show error message on non-zero response code', () => {
    const errgetProvTemplateResponse = {
      operation: {
        __value: 8
      },
      rc: {
        __value: 3
      },
      responseMsg: 'Table operation was successful',
      responseData: {
        ___v52Interface: null,
        ___v5Prov: {
          v5provid: '9',
          bcctimer: '10',
          cchnlinflist: [
            {
              chnlid: '0',
              lcc: {
                lnk: '1',
                chnl: '16'
              },
              cpathlist: ['CTRL']
            },
            {
              chnlid: '1',
              lcc: {
                lnk: '2',
                chnl: '15'
              },
              cpathlist: ['PSTN']
            }
          ],
          prot1: '2',
          prot2: [
            {
              lnk: '1',
              chnl: '15'
            }
          ],
          alarmthreshold: '50'
        },
        ___v5Sig: null,
        ___v5Ring: null,
        ___key_list: null,
        ___carrier_list: null,
        ___no_data: null,
        __discriminator: {
          __value: 2
        },
        __uninitialized: false
      }
    };
    interfaceBrowserService.getProvTemplate.and.returnValue(
      of(errgetProvTemplateResponse)
    );

    component.getProvTemplate('someIdentifier');
    expect(commonService.showErrorMessage).toHaveBeenCalled();
  });

  it('should add new item to prot2ListOptions and update form on success', () => {
    component.protForm.prot2Link = 'newLink';
    component.protForm.prot2Channel = 'newChannel';
    component.addToProt2List();
    const expectedNewItem = 'link:newLink;channel:newChannel';
    expect(component.prot2ListOptions).toContain(expectedNewItem);
    expect(component.form.get('prot2List')?.value).toBe(expectedNewItem);
    expect(component.protForm.prot2Link).toBe('');
    expect(component.protForm.prot2Channel).toBe('');
  });

  it('should show error messages if link and channel empty on adtoProtList', () => {
    component.protForm.prot2Link = '';
    component.protForm.prot2Channel = '';
    component.addToProt2List();

    expect(commonService.showErrorMessage).toHaveBeenCalled();
    component.protForm.prot2Link = 'asd';
    component.protForm.prot2Channel = '';
    component.addToProt2List();
    expect(commonService.showErrorMessage).toHaveBeenCalled();
  });

  it('should add new item to cchnlEntriesOptions and update form on success', () => {
    component.protForm.cchnlID = 'newID';
    component.protForm.link = 'newLink';
    component.protForm.channel = 'newChannel';
    component.protForm.cpath = [];
    component.protForm.cpath.push('CTRL');
    component.addToCchnlEntries();

    const expectedNewItem =
      'id:newID;link:newLink;channel:newChannel;cpath:CTRL';
    expect(component.cchnlEntriesOptions).toContain(expectedNewItem);
    expect(component.form.get('cchnlEntries')?.value).toBe(expectedNewItem);

    expect(component.protForm.cchnlID).toBe('');
    expect(component.protForm.link).toBe('');
    expect(component.protForm.channel).toBe('');
    expect(component.protForm.cpath).toEqual([]);
  });

  it('should show error messages if inputs are empty on add cchnl', () => {
    component.protForm.cchnlID = '';
    component.addToCchnlEntries();
    expect(commonService.showErrorMessage).toHaveBeenCalled();
    component.protForm.cchnlID = 'asd';
    component.protForm.link = '';
    component.addToCchnlEntries();
    expect(commonService.showErrorMessage).toHaveBeenCalled();
    component.protForm.cchnlID = 'asd';
    component.protForm.link = 'asd';
    component.protForm.channel = '';
    component.addToCchnlEntries();
    expect(commonService.showErrorMessage).toHaveBeenCalled();
    component.protForm.cchnlID = 'asd';
    component.protForm.link = 'asd';
    component.protForm.channel = 'asd';
    component.protForm.cpath = [];
    component.addToCchnlEntries();
    expect(commonService.showErrorMessage).toHaveBeenCalled();
  });

  it('should call addProv method when isAddProv is true', () => {
    spyOn(component, 'addProv');
    component.isAddProv = true;
    component.form.patchValue({
      identifier: 'someIdentifier',
      tbcc: 'someTimer',
      lkmjalm: 'someThreshold'
    });
    component.cchnlEntriesOptions = ['id:1;channel:2;link:3;cpath:CTRL'];
    const cchnlinflist = [
      { chnlid: '1', lcc: { chnl: '2', lnk: '3' }, cpathlist: 'CTRL' }
    ];
    component.prot2ListOptions = ['link:2;channel:2'];
    const prot2 = [{ lnk: '2', chnl: '2' }];

    component.onFormSubmit(true);
    expect(component.addProv).toHaveBeenCalled();
  });

  it('should call modify method when isAddProv is false', () => {
    spyOn(component, 'modifyProv');
    component.isAddProv = false;
    component.form.patchValue({
      identifier: 'someIdentifier',
      tbcc: 'someTimer',
      lkmjalm: 'someThreshold'
    });
    component.cchnlEntriesOptions = ['id:1;channel:2;link:3;cpath:CTRL'];
    const cchnlinflist = [
      { chnlid: '1', lcc: { chnl: '2', lnk: '3' }, cpathlist: 'CTRL' }
    ];
    component.prot2ListOptions = ['link:2;channel:2'];
    const prot2 = [{ lnk: '2', chnl: '2' }];

    component.onFormSubmit(true);
    expect(component.modifyProv).toHaveBeenCalled();
  });

  it('should call modify method when isAddProv is true', () => {
    spyOn(component, 'closeDialog');
    component.isAddProv = false;

    component.onFormSubmit(false);
    expect(component.closeDialog).toHaveBeenCalled();

    component.onFormSubmit(true);
    expect(commonService.showErrorMessage).toHaveBeenCalled();

    component.form.get('identifier')?.setValue('ad');
    component.onFormSubmit(true);
    expect(commonService.showErrorMessage).toHaveBeenCalled();

    component.form.get('identifier')?.setValue('ad');
    component.form.get('tbcc')?.setValue('ad');
    component.onFormSubmit(true);
    expect(commonService.showErrorMessage).toHaveBeenCalled();

    component.form.get('identifier')?.setValue('ad');
    component.form.get('tbcc')?.setValue('ad');
    component.form.get('lkmjalm')?.setValue('ad');
    component.onFormSubmit(true);
    expect(commonService.showErrorMessage).toHaveBeenCalled();
  });

  it('should call addProvTemplate and update UI on success', () => {
    component.form.patchValue({
      identifier: 'someIdentifier',
      tbcc: 'someTimer',
      lkmjalm: 'someThreshold',
      prot1: 'someProt1'
    });
    const cchnlinflist = [
      {
        chnlid: 'someID',
        lcc: { lnk: 'someLink', chnl: 'someChannel' },
        cpathlist: ['CTRL', 'PSTN']
      }
    ];
    const prot2 = [{ lnk: 'someLink', chnl: 'someChannel' }];
    component.addProv(cchnlinflist, prot2);
    expect(interfaceBrowserService.addProvTemplate).toHaveBeenCalledWith({
      v5provid: 'someIdentifier',
      bcctimer: 'someTimer',
      cchnlinflist: cchnlinflist,
      prot1: 'someProt1',
      prot2: prot2,
      alarmthreshold: 'someThreshold'
    });
  });

  it('close Dialog', () => {
    spyOn(component.form, 'reset');
    component.isAddProv = true;
    component.closeDialog();
    expect(component.form.reset).toHaveBeenCalled();
  });

  it('modifyProv error ', () => {
    const ErrmodifyProvTemplateResponse = {
      operation: {
        __value: 7
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
        ___no_data: 'No data',
        __discriminator: {
          __value: 0
        },
        __uninitialized: false
      }
    };
    interfaceBrowserService.modifyProvTemplate.and.returnValue(
      of(ErrmodifyProvTemplateResponse)
    );
    component.identifier = '2';
    component.form.patchValue({
      identifier: 'someIdentifier',
      tbcc: 'someTimer',
      lkmjalm: 'someThreshold',
      prot1: 'someProt1'
    });
    const cchnlinflist = [
      {
        chnlid: 'someID',
        lcc: { lnk: 'someLink', chnl: 'someChannel' },
        cpathlist: ['CTRL', 'PSTN']
      }
    ];
    const prot2 = [{ lnk: 'someLink', chnl: 'someChannel' }];
    component.modifyProv(cchnlinflist, prot2);
    expect(commonService.showErrorMessage).toHaveBeenCalled();
    interfaceBrowserService.modifyProvTemplate.and.returnValue(throwError(''));
    component.modifyProv(cchnlinflist, prot2);
    expect(commonService.showAPIError).toHaveBeenCalled();
  });

  it('modifyProv errors ', () => {
    component.identifier = '2';
    component.form.patchValue({
      identifier: 'someIdentifier',
      tbcc: 'someTimer',
      lkmjalm: 'someThreshold',
      prot1: 'someProt1'
    });
    const cchnlinflist = [
      {
        chnlid: 'someID',
        lcc: { lnk: 'someLink', chnl: 'someChannel' },
        cpathlist: ['CTRL', 'PSTN']
      }
    ];
    const prot2 = [{ lnk: 'someLink', chnl: 'someChannel' }];
    interfaceBrowserService.addProvTemplate.and.returnValue(
      of({
        rc: {
          __value: 4
        }
      })
    );
    component.modifyProv(cchnlinflist, prot2);
    interfaceBrowserService.addProvTemplate.and.returnValue(throwError('err'));
    component.modifyProv(cchnlinflist, prot2);
    expect(commonService.showAPIError).toHaveBeenCalled();
  });
  it('modifyProv errors2 ', () => {
    component.identifier = '2';
    component.form.patchValue({
      identifier: 'someIdentifier',
      tbcc: 'someTimer',
      lkmjalm: 'someThreshold',
      prot1: 'someProt1'
    });
    const cchnlinflist = [
      {
        chnlid: 'someID',
        lcc: { lnk: 'someLink', chnl: 'someChannel' },
        cpathlist: ['CTRL', 'PSTN']
      }
    ];
    const prot2 = [{ lnk: 'someLink', chnl: 'someChannel' }];
    interfaceBrowserService.addProvTemplate.and.returnValue(
      of({
        rc: {
          __value: 4
        }
      })
    );
    interfaceBrowserService.deleteProv.and.returnValue(throwError('err'));
    component.modifyProv(cchnlinflist, prot2);
    expect(commonService.showAPIError).toHaveBeenCalled();

  });
  it('modifyProv errors3 ', () => {
    component.identifier = '2';
    component.form.patchValue({
      identifier: 'someIdentifier',
      tbcc: 'someTimer',
      lkmjalm: 'someThreshold',
      prot1: 'someProt1'
    });
    const cchnlinflist = [
      {
        chnlid: 'someID',
        lcc: { lnk: 'someLink', chnl: 'someChannel' },
        cpathlist: ['CTRL', 'PSTN']
      }
    ];
    const prot2 = [{ lnk: 'someLink', chnl: 'someChannel' }];
    interfaceBrowserService.modifyProvTemplate.and.returnValue(throwError('err'));
    component.modifyProv(cchnlinflist, prot2);
    expect(commonService.showAPIError).toHaveBeenCalled();

  });
  it('addProv error ', () => {
    const ErraddProvTemplateResponse = {
      operation: {
        __value: 5
      },
      rc: {
        __value: 4
      },
      responseMsg: 'Table operation was successful',
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
    interfaceBrowserService.addProvTemplate.and.returnValue(
      of(ErraddProvTemplateResponse)
    );
    component.form.patchValue({
      identifier: 'someIdentifier',
      tbcc: 'someTimer',
      lkmjalm: 'someThreshold',
      prot1: 'someProt1'
    });
    const cchnlinflist = [
      {
        chnlid: 'someID',
        lcc: { lnk: 'someLink', chnl: 'someChannel' },
        cpathlist: ['CTRL', 'PSTN']
      }
    ];
    const prot2 = [{ lnk: 'someLink', chnl: 'someChannel' }];
    component.addProv(cchnlinflist, prot2);
    expect(commonService.showErrorMessage).toHaveBeenCalled();
    interfaceBrowserService.addProvTemplate.and.returnValue(throwError(''));
    component.addProv(cchnlinflist, prot2);
    expect(commonService.showAPIError).toHaveBeenCalled();
  });
});
