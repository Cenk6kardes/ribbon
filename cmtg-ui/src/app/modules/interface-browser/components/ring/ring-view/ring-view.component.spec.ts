import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RingViewComponent } from './ring-view.component';
import { AppModule } from 'src/app/app.module';
import { TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { TranslateInternalService } from 'src/app/services/translate-internal.service';
import { InterfaceBrowserService } from '../../../services/interface-browser.service';
import { BehaviorSubject, of, throwError } from 'rxjs';

describe('RingViewComponent', () => {
  let component: RingViewComponent;
  let fixture: ComponentFixture<RingViewComponent>;
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
          TITLE: 'V5 Ring View',
          HEADER: {
            ADD_NEW_V5RING: 'Add New V5Ring',
            DELETE_IDENTIFIER: 'Delete Identifier'
          },
          FIELD_LABEL: {
            NEW_V5_RING: 'New V5Ring',
            STD: 'STD',
            IDENTIFIER: 'Identifier',
            Select_DELETE_IDENTIFIER: 'Select the identifier to delete',
            SUCCESS: 'Template {{action}} successfully.'
          }
        }
      }
    }
  };
  const getIdResponse = {
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

  const deleteResponse = {
    operation: {
      __value: 11
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
      ___no_data: 'TEST33',
      __discriminator: {
        __value: 0
      },
      __uninitialized: false
    }
  };

  const commonService = jasmine.createSpyObj('commonService', [
    'showErrorMessage',
    'showAPIError','showSuccessMessage'
  ]);
  const interfaceBrowserService = jasmine.createSpyObj(
    'interfaceBrowserService',
    ['getRingTemplateId', 'deleteRing']
  );

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RingViewComponent],
      imports: [AppModule, TranslateModule.forRoot()],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: CommonService, useValue: commonService },
        { provide: TranslateInternalService, useValue: translate },
        { provide: InterfaceBrowserService, useValue: interfaceBrowserService }
      ]
    }).compileComponents();

    interfaceBrowserService.getRingTemplateId.and.returnValue(
      of(getIdResponse)
    );
    interfaceBrowserService.deleteRing.and.returnValue(of(deleteResponse));
    fixture = TestBed.createComponent(RingViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize page header', () => {
    spyOn(component, 'initPageHeader');

    component.initPageHeader();

    expect(component.initPageHeader).toHaveBeenCalled();
    expect(component.headerData.title).toBe(
      translate.translateResults.INTERFACE_BROWSER.V5_RING_VIEW.TITLE
    );
  });

  it('should close dialog and call getIdentifiers if isChanged is true', () => {
    const isChanged = true;

    spyOn(component, 'getIdentifiers');
    component.isShowAddRing = true;
    component.isShowDeleteRing = true;

    component.closeDialog(isChanged);

    expect(component.getIdentifiers).toHaveBeenCalled();
    expect(component.isShowAddRing).toBe(false);
    expect(component.isShowDeleteRing).toBe(false);
  });

  it('should close dialog without calling getIdentifiers if isChanged is false', () => {
    const isChanged = false;

    spyOn(component, 'getIdentifiers');
    component.isShowAddRing = true;
    component.isShowDeleteRing = true;

    component.closeDialog(isChanged);

    expect(component.getIdentifiers).not.toHaveBeenCalled();
    expect(component.isShowAddRing).toBe(false);
    expect(component.isShowDeleteRing).toBe(false);
  });

  it('should disable the button when the event matches the first item in identifiers', () => {
    expect(component.isButtonDisabled).toBe(false);

    component.identifiers = ['DEFAULT', 'TEST1', 'TEST2'];
    component.handleChange('DEFAULT');

    expect(component.isButtonDisabled).toBe(true);
  });

  it('should enable the button when the event does not match the first item in identifiers', () => {
    expect(component.isButtonDisabled).toBe(false);

    component.identifiers = ['DEFAULT', 'TEST1', 'TEST2'];
    component.handleChange('TEST2');

    expect(component.isButtonDisabled).toBe(false);
  });

  it('should call deleteRing and closeDialog if event is true', () => {
    const selectedIdentifier = 'identifierToDelete';

    component.selectedIdentifierToDelete = selectedIdentifier;
    component.deleteSelectedIdentifier(true);

    expect(interfaceBrowserService.deleteRing).toHaveBeenCalledWith(
      selectedIdentifier
    );

    expect(component.isShowAddRing).toBe(false);
    expect(component.isShowDeleteRing).toBe(false);
  });

  it('should  closeDialog if event is false', () => {
    spyOn(component,'closeDialog');
    const selectedIdentifier = '';

    component.selectedIdentifierToDelete = selectedIdentifier;
    component.deleteSelectedIdentifier(false);

    expect(component.closeDialog).toHaveBeenCalled();
  });

  it('should call showErrorMessage if deleteRing returns an error', () => {
    const selectedIdentifier = 'identifierToDelete';
    const errorMessage = 'API error message';
    const error = new Error(errorMessage);

    interfaceBrowserService.deleteRing.and.returnValue(throwError(error));

    component.selectedIdentifierToDelete = selectedIdentifier;
    component.deleteSelectedIdentifier(true);

    expect(interfaceBrowserService.deleteRing).toHaveBeenCalledWith(
      selectedIdentifier
    );
    expect(commonService.showAPIError).toHaveBeenCalled();
  });

  it('should call showApiError if the request returns an error', () => {
    interfaceBrowserService.getRingTemplateId.and.returnValue(
      throwError('error')
    );

    component.getIdentifiers();

    expect(commonService.showAPIError).toHaveBeenCalled();
  });

  it('should set identifiers and call  if the request is successful but has Validation error', () => {
    const response = {
      rc: { __value: 8 },
      responseMsg: 'Validation Error',
      responseData: { ___key_list: ['id1', 'id2', 'id3'] }
    };

    interfaceBrowserService.getRingTemplateId.and.returnValue(of(response));

    component.getIdentifiers();

    expect(commonService.showErrorMessage).toHaveBeenCalled();
  });

  it('should set isShowAddRing to true when openAddDialog is called', () => {
    component.openAddDialog();
    expect(component.isShowAddRing).toBe(true);
  });
  it('should set isShowDeleteRing to true when openDeleteDialog is called', () => {
    component.openDeleteDialog();
    expect(component.isShowDeleteRing).toBe(true);
  });

});
