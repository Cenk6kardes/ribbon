import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterfaceToCarrierComponent } from './interface-to-carrier.component';
import { AppModule } from 'src/app/app.module';
import { TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { TranslateInternalService } from 'src/app/services/translate-internal.service';
import { InterfaceBrowserService } from '../../../services/interface-browser.service';
import { of, throwError } from 'rxjs';

describe('InterfaceToCarrierComponent', () => {
  let component: InterfaceToCarrierComponent;
  let fixture: ComponentFixture<InterfaceToCarrierComponent>;
  const translate = {
    translateResults: {
      INTERFACE_BROWSER: {
        MAINTENANCE: {
          TITLE: 'V5.2 Maintenance',
          TABS: {
            INTERFACE_TO_CARRIER: 'Interface to Carrier Mapping',
            CARRIER_TO_INTERFACE: 'Carrier to Interface Mapping'
          },
          FIELD_LABELS: {
            INTERFACE: 'V5.2 Interface',
            WILDCARD: 'Wildcard',
            GATEWAY_NAME: 'Gateway Name',
            CARRIER_NAME: 'Carrier Name',
            RETRIEVE: 'Retrieve'
          },
          ERROR_MESSAGES: {
            GATEWAYNAME_REQUIRED:
              'Please select an available gateway, and try again.',
            CARRIERNAME_REQUIRED:
              'Please select an available carrier, and try again.'
          }
        }
      }
    }
  };

  const commonService = jasmine.createSpyObj('commonService', [
    'showErrorMessage',
    'showAPIError'
  ]);

  const getInterfaceBrowserTemplateIDResponse = {
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

  const getInterfaceBrowserTemplateResponse = {
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

  const interfaceBrowserService = jasmine.createSpyObj(
    'interfaceBrowserService',
    {
      getInterfaceBrowserTemplateID: of(getInterfaceBrowserTemplateIDResponse),
      getInterfaceBrowserTemplate: of(getInterfaceBrowserTemplateResponse)
    }
  );

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InterfaceToCarrierComponent],
      imports: [AppModule, TranslateModule.forRoot()],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: CommonService, useValue: commonService },
        { provide: TranslateInternalService, useValue: translate },
        { provide: InterfaceBrowserService, useValue: interfaceBrowserService }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(InterfaceToCarrierComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getTableData if event is true', () => {
    spyOn(component, 'getTableData');

    component.handleEvent(true);

    expect(component.getTableData).toHaveBeenCalled();
  });

  it('should clear data if event is false', () => {
    component.data = [{ linkId: '123', epGrp: 'asd' }];

    component.handleEvent(false);

    expect(component.data).toEqual([]);
  });

  it('should update data and set isInprocess to false on successful service call', () => {
    component.form.get('interfaceId')?.setValue(102);
    component.getTableData();

    expect(
      interfaceBrowserService.getInterfaceBrowserTemplate
    ).toHaveBeenCalledWith(102);
    expect(component.isInprocess).toBe(false);
  });

  it('should get table data error ', () => {
    interfaceBrowserService.getInterfaceBrowserTemplate.and.returnValue(
      throwError('err')
    );
    component.getTableData();
    expect(commonService.showAPIError).toHaveBeenCalled();
  });

});
