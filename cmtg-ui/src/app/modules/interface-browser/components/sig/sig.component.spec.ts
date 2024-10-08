import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SigComponent } from './sig.component';
import { AppModule } from 'src/app/app.module';
import { TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { TranslateInternalService } from 'src/app/services/translate-internal.service';
import { InterfaceBrowserService } from '../../services/interface-browser.service';
import { of, throwError } from 'rxjs';

describe('SigComponent', () => {
  let component: SigComponent;
  let fixture: ComponentFixture<SigComponent>;

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

  const deleteSigResponse = {
    operation: {
      __value: 16
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
      ___no_data: 'TST',
      __discriminator: {
        __value: 0
      },
      __uninitialized: false
    }
  };

  const translate = {
    translateResults: {
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
      },
      INTERFACE_BROWSER: {
        V5_RING_VIEW: {
          ERROR_MESSAGES: {
            IDENTIFIER_REQUIRED: 'Identifier Required'
          },
          FIELD_LABEL:{
            SUCCESS: 'Template {{action}} successfully.'
          }
        },

        V5_SIG: {
          TITLE: 'V5 SIG View',
          FIELD_LABEL: {
            NEW_V5_SIG: 'New V5SIG',
            ATTEN: 'ATTEN',
            PLF: 'PLF',
            APA: 'APA',
            DS1FLASH: 'DS1FLASH',
            EOC: 'EOC',
            SUPPIND: 'SUPPIND',
            PLSDUR: 'PLSDUR',
            MTRPN: 'MTRPN',
            LROA: 'LROA',
            LROSFD: 'LROSFD',
            RNGTYPE: 'RNGTYPE',
            SSONHOOK: 'SSONHOOK',
            IDENTIFIER: 'Identifier'
          }
        }
      }
    }
  };
  const commonService = jasmine.createSpyObj('commonService', [
    'showErrorMessage',
    'showAPIError',
    'showSuccessMessage'
  ]);
  const interfaceBrowserService = jasmine.createSpyObj(
    'interfaceBrowserService',
    ['getSigTemplateId', 'deleteSig']
  );
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SigComponent],
      imports: [AppModule, TranslateModule.forRoot()],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: CommonService, useValue: commonService },
        { provide: TranslateInternalService, useValue: translate },
        { provide: InterfaceBrowserService, useValue: interfaceBrowserService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SigComponent);
    component = fixture.componentInstance;
    interfaceBrowserService.getSigTemplateId.and.returnValue(
      of(getSigIdResponse)
    );
    interfaceBrowserService.deleteSig.and.returnValue(of(deleteSigResponse));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show apierror when getSigid request response has error ', () => {
    interfaceBrowserService.getSigTemplateId.and.returnValue(
      throwError('error')
    );
    component.getSigIdentifiers();
    expect(commonService.showAPIError).toHaveBeenCalled();
  });

  it('should close dialog and not call getSigIdentifiers when isChanged is false', () => {
    spyOn(component, 'getSigIdentifiers');
    component.isShowAddSig = true;
    component.isShowDeleteSig = true;

    component.closeDialog(false);

    expect(component.getSigIdentifiers).not.toHaveBeenCalled();
    expect(component.isShowAddSig).toBe(false);
    expect(component.isShowDeleteSig).toBe(false);
  });

  it('should close dialog and call getSigIdentifiers when isChanged is true', () => {
    spyOn(component, 'getSigIdentifiers');
    component.isShowAddSig = true;
    component.isShowDeleteSig = true;

    component.closeDialog(true);

    expect(component.getSigIdentifiers).toHaveBeenCalled();
    expect(component.isShowAddSig).toBe(false);
    expect(component.isShowDeleteSig).toBe(false);
  });

  it('delete should call closeDialog(false) when event is false', () => {
    spyOn(component, 'closeDialog');
    component.isInprocess = false;
    component.selectedIdentifierToDelete = 'DEFAULT';

    component.deleteSelectedIdentifier(false);

    expect(component.closeDialog).toHaveBeenCalledWith(false);
  });

  it('delete should call closeDialog(true) and handle a successful response when event is true', () => {
    spyOn(component, 'closeDialog');
    const id = 'DEFAULT';
    component.selectedIdentifierToDelete = id;

    component.deleteSelectedIdentifier(true);

    expect(interfaceBrowserService.deleteSig).toHaveBeenCalledWith(id);
    expect(component.isInprocess).toBe(false);
  });

  it('should show api error on error delete response', () => {
    const id = 'DEFAULT';
    component.selectedIdentifierToDelete = id;
    interfaceBrowserService.deleteSig.and.returnValue(throwError('error'));

    component.deleteSelectedIdentifier(true);

    expect(commonService.showAPIError).toHaveBeenCalled();
  });

  // it('should set isButtonDisabled to true when event is the same as the first identifier', () => {
  //   component.isButtonDisabled = false;
  //   component.identifiers = ['identifier1', 'identifier2'];

  //   component.handleChange('identifier1');

  //   expect(component.isButtonDisabled).toBe(true);
  // });

  // it('should set isButtonDisabled to false when event is different from the first identifier', () => {
  //   component.isButtonDisabled = true;
  //   component.identifiers = ['identifier1', 'identifier2'];

  //   component.handleChange('identifier2');

  //   expect(component.isButtonDisabled).toBe(false);
  // });

  it('should set isShowDeleteSig to true', () => {
    component.isShowDeleteSig = false;

    component.openDeleteDialog();

    expect(component.isShowDeleteSig).toBe(true);
  });

  it('should set isShowAddSig to true', () => {
    component.isShowAddSig = false;

    component.openAddDialog();

    expect(component.isShowAddSig).toBe(true);
  });

  it('should show error on delete if response rc != 0 ', () => {
    component.selectedIdentifierToDelete = 's';
    interfaceBrowserService.deleteSig.and.returnValue(
      of({ rc: { __value: 2 } })
    );
    component.deleteSelectedIdentifier(true);
    expect(commonService.showErrorMessage).toHaveBeenCalled();
  });

  it('should show error on getSig if response rc != 0 ', () => {
    interfaceBrowserService.getSigTemplateId.and.returnValue(
      of({ rc: { __value: 2 } })
    );
    component.getSigIdentifiers();
    expect(commonService.showErrorMessage).toHaveBeenCalled();
  });
});
