import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RingComponent } from './ring.component';
import { AppModule } from 'src/app/app.module';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA, SimpleChange, SimpleChanges } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { TranslateInternalService } from 'src/app/services/translate-internal.service';
import { InterfaceBrowserService } from '../../../services/interface-browser.service';

describe('RingComponent', () => {
  let component: RingComponent;
  let fixture: ComponentFixture<RingComponent>;
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
          },
          ERROR_MESSAGES: {
            IDENTIFIER_REQUIRED: 'Identifier Required'
          }
        },
        ERROR: {
          GAP_DETECTED: 'There is a gap in the Link Mapping Data. Please ensure there are no gaps before adding this interface',
          ADD_RING_NULL: 'A field Value is set to null'
        }
      }
    }
  };

  const addResponse = {
    operation: {
      __value: 10
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

  const ringTemplate = {
    v5ringid: 'testing',
    std: '2',
    r01: '1',
    r02: '0',
    r03: '4',
    r04: '3',
    r05: '1',
    r06: '3',
    r07: '1',
    r08: '0',
    r09: '0',
    r10: '6',
    r11: '4',
    r12: '2',
    r13: '6',
    r14: '3',
    r15: '1'
  };

  const modifyResponse = {
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
      ___key_list: ['DEFAULT', 'TESTING', 'TEST33'],
      ___carrier_list: null,
      ___no_data: null,
      __discriminator: {
        __value: 5
      },
      __uninitialized: false
    }
  };

  const getRingTemplateResponse = {
    operation: {
      __value: 13
    },
    rc: {
      __value: 0
    },
    responseMsg: 'Table operation was successful',
    responseData: {
      ___v52Interface: null,
      ___v5Prov: null,
      ___v5Sig: null,
      ___v5Ring: {
        v5ringid: 'TEST33',
        std: '1',
        r01: '4',
        r02: '5',
        r03: '7',
        r04: '0',
        r05: '2',
        r06: '2',
        r07: '0',
        r08: '1',
        r09: '0',
        r10: '2',
        r11: '1',
        r12: '2',
        r13: '3',
        r14: '4',
        r15: '0'
      },
      ___key_list: null,
      ___carrier_list: null,
      ___no_data: null,
      __discriminator: {
        __value: 4
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
    'interfaceBrowserService',['getRingTemplate', 'addNewRing', 'modifyRing']);
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RingComponent],
      imports: [AppModule, TranslateModule.forRoot()],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: CommonService, useValue: commonService },
        { provide: TranslateInternalService, useValue: translate },
        { provide: InterfaceBrowserService, useValue: interfaceBrowserService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RingComponent);
    component = fixture.componentInstance;
    interfaceBrowserService.addNewRing.and.returnValue(of(addResponse));
    interfaceBrowserService.modifyRing.and.returnValue(of(modifyResponse));
    interfaceBrowserService.getRingTemplate.and.returnValue(
      of(getRingTemplateResponse)
    );
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit isChanged value when closeDialog is called', () => {
    let emittedValue: boolean | undefined;

    component.closeDialogEmitter.subscribe((value) => {
      emittedValue = value;
    });

    component.closeDialog(true);

    expect(emittedValue).toBe(true);

    component.closeDialog(false);

    expect(emittedValue).toBe(false);
  });

  it('should return the identifier form control', () => {
    component.initForm();
    const identifierControl = component.identifier;

    expect(identifierControl).toBeTruthy();
  });

  it('should return the std form control', () => {
    component.initForm();

    const stdControl = component.std;

    expect(stdControl).toBeTruthy();
  });

  it('should call getRingTemplate and set isButtonDisabled to true', () => {
    component.initForm();
    component.identifiers = ['Identifier1', 'Identifier2', 'Identifier3'];

    spyOn(component, 'getRingTemplate');
    component.handleChangeIdentifier('Identifier1');

    expect(component.getRingTemplate).toHaveBeenCalledWith('Identifier1');

    expect(component.isButtonDisabled).toBe(true);
  });

  it('should add a new ring successfully', () => {
    component.isInprocess = false;
    component.ringTemplate = ringTemplate;
    spyOn(component, 'closeDialog');

    component.addRing();

    expect(interfaceBrowserService.addNewRing).toHaveBeenCalledWith(
      component.ringTemplate
    );

  });

  it('should handle an Apierror when adding a new ring', () => {
    component.ringTemplate = ringTemplate;
    interfaceBrowserService.addNewRing.and.returnValue(throwError('error'));

    component.addRing();

    expect(interfaceBrowserService.addNewRing).toHaveBeenCalledWith(
      component.ringTemplate
    );

    expect(commonService.showAPIError).toHaveBeenCalled();
  });

  it('should give error message if modify request is successful but has Validation error', () => {
    const response = {
      operation: {
        __value: 10
      },
      rc: {
        __value: 8
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
    component.formGroup.markAsDirty();

    interfaceBrowserService.addNewRing.and.returnValue(of(response));

    component.addRing();

    expect(commonService.showErrorMessage).toHaveBeenCalledWith(
      response.responseMsg
    );
  });

  it('should modify a ring successfully with confirmation', () => {
    component.formGroup.markAsDirty();
    component.ringTemplate = ringTemplate;

    component.modifyRing(true);

    expect(interfaceBrowserService.modifyRing).toHaveBeenCalledWith(
      component.ringTemplate
    );
  });

  it('should give error message if modify request is successful but has Validation error', () => {
    const response = {
      operation: {
        __value: 14
      },
      rc: {
        __value: 8
      },
      responseMsg: 'Table operation was successful',
      responseData: {
        ___v52Interface: null,
        ___v5Prov: null,
        ___v5Sig: null,
        ___v5Ring: null,
        ___key_list: ['DEFAULT', 'TESTING', 'TEST33'],
        ___carrier_list: null,
        ___no_data: null,
        __discriminator: {
          __value: 5
        },
        __uninitialized: false
      }
    };
    component.formGroup.markAsDirty();

    interfaceBrowserService.modifyRing.and.returnValue(of(response));

    component.modifyRing(true);

    expect(commonService.showErrorMessage).toHaveBeenCalledWith(
      response.responseMsg
    );
  });

  it('should give apierror on modify request ', () => {
    component.formGroup.markAsDirty();
    interfaceBrowserService.modifyRing.and.returnValue(throwError('error'));

    component.modifyRing(true);

    expect(commonService.showAPIError).toHaveBeenCalled();
  });

  it('should getRingdatas when cancelled  ', () => {
    component.formGroup.markAsDirty();
    spyOn(component, 'getRingTemplate');

    component.modifyRing(false);

    expect(component.getRingTemplate).toHaveBeenCalled();
  });

  // it('should call modifyRing on confirm', () => {
  //   spyOn(component, 'modifyRing');
  //   component.ringTemplate = ringTemplate;
  //   component.isAddRing = false;

  //   component.onFormSubmit(true);

  //   expect(component.modifyRing).toHaveBeenCalled();
  // });

  it('should show identifier required error on formsubmit ', () => {
    component.formGroup.get('identifier')?.setValue('');
    component.isAddRing = true;
    component.onFormSubmit(true);
    expect(commonService.showErrorMessage).toHaveBeenCalled();
  });

  it('should getRing template ', () => {
    component.getRingTemplate('TEST');
    expect(interfaceBrowserService.getRingTemplate).toHaveBeenCalledWith(
      'TEST'
    );
  });

  it('should call getRingTemplate and set isButtonDisabled when identifiers and !isAddRing', () => {
    spyOn(component, 'getRingTemplate');
    const mockIdentifiers = ['exampleIdentifier'];
    component.identifiers = ['e', 'b'];
    component.isAddRing = false;
    const mockChanges: SimpleChanges = {
      identifiers: new SimpleChange(undefined, mockIdentifiers, true),
      isAddRing: new SimpleChange(undefined, false, true)
    };
    component.ngOnChanges(mockChanges);
    expect(component.isButtonDisabled).toBeTruthy();
    expect(component.getRingTemplate).toHaveBeenCalled();
  });

  it('should disable button if isAddRing is true and form is invalid > updateButtonStatus()', () => {
    component.isAddRing = true;
    component.formGroup.setErrors({ 'invalid': true });
    component.updateButtonStatus();
    expect(component.isButtonDisabled).toBe(true);
  });
});
