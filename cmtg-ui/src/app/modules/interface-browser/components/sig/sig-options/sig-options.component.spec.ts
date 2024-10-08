import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SigOptionsComponent } from './sig-options.component';
import { AppModule } from 'src/app/app.module';
import { TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA, SimpleChanges } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { TranslateInternalService } from 'src/app/services/translate-internal.service';
import { InterfaceBrowserService } from '../../../services/interface-browser.service';
import { of, throwError } from 'rxjs';

describe('SigOptionsComponent', () => {
  let component: SigOptionsComponent;
  let fixture: ComponentFixture<SigOptionsComponent>;

  const translate = {
    translateResults: {
      INTERFACE_BROWSER: {
        V5_RING_VIEW: {
          ERROR_MESSAGES: {
            IDENTIFIER_REQUIRED: 'Identifier Required'
          },
          FIELD_LABEL:{
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
  };
  const getSigTemplateResponse = {
    operation: {
      __value: 18
    },
    rc: {
      __value: 0
    },
    responseMsg: 'Table operation was successful',
    responseData: {
      ___v52Interface: null,
      ___v5Prov: null,
      ___v5Sig: {
        v5sigid: 'DEFAULT',
        atten: {
          __value: 1
        },
        apa: false,
        plf: false,
        ds1flash: false,
        eoc: false,
        suppind: {
          __value: 0
        },
        plsdur: '1',
        mtrpn: false,
        lroa: {
          __value: 0
        },
        lrosfd: false,
        rngtype: {
          __value: 2
        },
        ssonhook: false
      },
      ___v5Ring: null,
      ___key_list: null,
      ___carrier_list: null,
      ___no_data: null,
      __discriminator: {
        __value: 3
      },
      __uninitialized: false
    }
  };

  const addSigResponse = {
    operation: {
      __value: 15
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

  const modifySigResponse = {
    operation: {
      __value: 17
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
  const commonService = jasmine.createSpyObj('commonService', [
    'showErrorMessage',
    'showAPIError',
    'showSuccessMessage'
  ]);

  const interfaceBrowserService = jasmine.createSpyObj(
    'interfaceBrowserService',
    ['getSigTemplate', 'addNewSig', 'modifySig']
  );

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SigOptionsComponent],
      imports: [AppModule, TranslateModule.forRoot()],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: CommonService, useValue: commonService },
        { provide: TranslateInternalService, useValue: translate },
        { provide: InterfaceBrowserService, useValue: interfaceBrowserService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SigOptionsComponent);
    component = fixture.componentInstance;
    interfaceBrowserService.getSigTemplate.and.returnValue(
      of(getSigTemplateResponse)
    );
    interfaceBrowserService.addNewSig.and.returnValue(of(addSigResponse));
    interfaceBrowserService.modifySig.and.returnValue(of(modifySigResponse));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call modifySig when isAddSig is false and confirm is true', () => {
    spyOn(component, 'modifySig');
    component.isAddSig = false;
    component.onFormSubmit(true);

    expect(component.modifySig).toHaveBeenCalledWith(true);
  });

  it('should show error message and return when isAddSig is true, confirm is true, and v5sigid is missing', () => {
    component.isAddSig = true;
    component.sigItems = {
      v5sigid: '',
      atten: 0,
      apa: false,
      plf: false,
      ds1flash: false,
      eoc: false,
      suppind: 0,
      plsdur: '',
      mtrpn: false,
      lroa: 0,
      lrosfd: false,
      rngtype: 0,
      ssonhook: false
    };
    component.onFormSubmit(true);

    expect(commonService.showErrorMessage).toHaveBeenCalled();
  });
  it('should call addSig when isAddSig is true, confirm is true, and v5sigid is present', () => {
    spyOn(component, 'addSig');
    component.isAddSig = true;
    component.sigItems = {
      v5sigid: 'asd',
      atten: 0,
      apa: false,
      plf: false,
      ds1flash: false,
      eoc: false,
      suppind: 0,
      plsdur: '',
      mtrpn: false,
      lroa: 0,
      lrosfd: false,
      rngtype: 0,
      ssonhook: false
    };
    component.onFormSubmit(true);

    expect(component.addSig).toHaveBeenCalled();
  });

  it('should successfully getsigTemplate', () => {
    component.getSigTemplate('DEFAULT');
    expect(interfaceBrowserService.getSigTemplate).toHaveBeenCalled();
  });

  it('should give error on getSigTEmplate', () => {
    const response = {
      operation: {
        __value: 18
      },
      rc: {
        __value: 3
      },
      responseMsg: 'Table operation was successful',
      responseData: {
        ___v52Interface: null,
        ___v5Prov: null,
        ___v5Sig: {
          v5sigid: 'DEFAULT',
          atten: {
            __value: 1
          },
          apa: false,
          plf: false,
          ds1flash: false,
          eoc: false,
          suppind: {
            __value: 0
          },
          plsdur: '1',
          mtrpn: false,
          lroa: {
            __value: 0
          },
          lrosfd: false,
          rngtype: {
            __value: 2
          },
          ssonhook: false
        },
        ___v5Ring: null,
        ___key_list: null,
        ___carrier_list: null,
        ___no_data: null,
        __discriminator: {
          __value: 3
        },
        __uninitialized: false
      }
    };
    interfaceBrowserService.getSigTemplate.and.returnValue(of(response));
    component.getSigTemplate('DEFAULT');
    expect(commonService.showErrorMessage).toHaveBeenCalledWith(
      response.responseMsg
    );
    interfaceBrowserService.getSigTemplate.and.returnValue(throwError('error'));
    component.getSigTemplate('DEFAULT');
    expect(commonService.showAPIError).toHaveBeenCalled();
  });

  it('should call getSigTemplate and disable button when identifiers change and isAddSig is false', () => {
    spyOn(component, 'getSigTemplate');
    component.isAddSig = false;
    component.identifiers = ['DEFAULT', 'TEST'];
    const changes: SimpleChanges = {
      identifiers: {
        currentValue: ['someIdentifier'],
        previousValue: [],
        firstChange: true,
        isFirstChange: () => true
      }
    };

    component.ngOnChanges(changes);

    expect(component.getSigTemplate).toHaveBeenCalledWith('DEFAULT');
    expect(component.isButtonDisabled).toBe(true);
  });

  it('should handleChangeIdentifier call getSigTemplate and disable button when isAddSig is false', () => {
    spyOn(component, 'getSigTemplate');
    component.isAddSig = false;
    const identifier = 'DEFAULT';
    component.identifiers = [identifier];

    component.handleChangeIdentifier(identifier);

    expect(component.getSigTemplate).toHaveBeenCalledWith(identifier);
    expect(component.isButtonDisabled).toBe(true);
  });

  it('should call service and close Dialog when addSig called successfully', () => {
    component.addSig();
    expect(interfaceBrowserService.addNewSig).toHaveBeenCalled();
  });

  it('should give apiError on unsuccessful request when addSig', () => {
    interfaceBrowserService.addNewSig.and.returnValue(throwError('error'));
    component.addSig();
    expect(commonService.showAPIError).toHaveBeenCalled();
  });

  it('should call modifysig on service when modifysig called', () => {
    component.modifySig(true);
    expect(interfaceBrowserService.modifySig).toHaveBeenCalled();
  });

  it('should getsigtemplate when modifysig cancelled ', () => {
    spyOn(component, 'getSigTemplate');
    component.modifySig(false);
    expect(component.getSigTemplate).toHaveBeenCalled();
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
  it('should call close dialog on cancel form', () => {
    spyOn(component, 'closeDialog');
    component.isAddSig=true;
    component.onFormSubmit(false);

    expect(component.closeDialog).toHaveBeenCalledWith(false);
  });

});
