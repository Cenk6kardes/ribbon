import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarrierToInterfaceComponent } from './carrier-to-interface.component';
import { CommonService } from 'src/app/services/common.service';
import { TranslateInternalService } from 'src/app/services/translate-internal.service';
import { InterfaceBrowserService } from '../../../services/interface-browser.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AppModule } from 'src/app/app.module';
import { TranslateModule } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';

describe('CarrierToInterfaceComponent', () => {
  let component: CarrierToInterfaceComponent;
  let fixture: ComponentFixture<CarrierToInterfaceComponent>;

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

  const carrierInterfaceMappingResponse = {
    operation: {
      __value: 20
    },
    rc: {
      __value: 0
    },
    responseMsg: 'Map carrier to interface operation was successful',
    responseData: {
      ___v52Interface: null,
      ___v5Prov: null,
      ___v5Sig: null,
      ___v5Ring: null,
      ___key_list: null,
      ___carrier_list: [
        {
          carrier: 'TDMs16c1f1/1/1/1',
          interfaceID: 102
        }
      ],
      ___no_data: null,
      __discriminator: {
        __value: 6
      },
      __uninitialized: false
    }
  };

  const commonService = jasmine.createSpyObj('commonService', [
    'showErrorMessage',
    'showAPIError'
  ]);

  const interfaceBrowserService = jasmine.createSpyObj(
    'interfaceBrowserService',
    ['carrierInterfaceMapping']
  );

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CarrierToInterfaceComponent],
      imports: [AppModule, TranslateModule.forRoot()],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: CommonService, useValue: commonService },
        { provide: TranslateInternalService, useValue: translate },
        { provide: InterfaceBrowserService, useValue: interfaceBrowserService }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(CarrierToInterfaceComponent);
    component = fixture.componentInstance;
    interfaceBrowserService.carrierInterfaceMapping.and.returnValue(of(carrierInterfaceMappingResponse));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with default values and subscribe to wildCard changes', () => {
    component.initForm();

    expect(component.form.get('wildCard')?.value).toBe(false);
    expect(component.form.get('gatewayName')?.value).toBe('');
    expect(component.form.get('carrierName')?.value).toBe('');

    component.form.get('wildCard')?.setValue(true);
    expect(component.form.get('carrierName')?.value).toBe('');
    expect(component.form.get('carrierName')?.disabled).toBe(true);
    expect(component.form.get('carrierName')?.getError('required')).toBeNull();

    component.form.get('wildCard')?.setValue(false);
    expect(component.form.get('carrierName')?.enabled).toBe(true);
    expect(
      component.form.get('carrierName')?.getError('required')
    ).not.toBeNull();
  });

  it('should clear the data array', () => {
    component.data = [{ carrier: 's', interfaceID: 1 }];

    component.clearTable();

    expect(component.data.length).toBe(0);
  });

  it('should call getTableDatas if form is valid', () => {
    spyOn(component, 'getTableDatas');
    component.form.setValue({
      gatewayName: 'asd',
      carrierName: 'asd',
      wildCard: 'false'
    });

    component.handleMapping();

    expect(component.getTableDatas).toHaveBeenCalled();
  });

  it('should give error  gateway error message on getTableDatas if gateway is invalid', () => {
    component.form.markAllAsTouched();
    component.form.setValue({
      gatewayName: '',
      carrierName: '',
      wildCard: true
    });
    component.handleMapping();

    expect(commonService.showErrorMessage).toHaveBeenCalledWith(
      translate.translateResults.INTERFACE_BROWSER.MAINTENANCE.ERROR_MESSAGES
        .GATEWAYNAME_REQUIRED
    );
  });

  it('should give error  carrier error message on getTableDatas if carrier is invalid', () => {
    component.form.reset();
    component.form.markAllAsTouched();
    component.form.setValue({
      gatewayName: 'asd',
      carrierName: '',
      wildCard: false
    });

    component.handleMapping();

    expect(commonService.showErrorMessage).toHaveBeenCalledWith(
      translate.translateResults.INTERFACE_BROWSER.MAINTENANCE.ERROR_MESSAGES
        .CARRIERNAME_REQUIRED
    );
  });

  it('should populate data on successful service call', () => {
    component.gatewayName?.setValue('Gateway');
    component.carrierName?.setValue('carrier');
    component.wildCard?.setValue(false);

    component.getTableDatas();

    expect(component.data).toEqual([
      {
        carrier: 'TDMs16c1f1/1/1/1',
        interfaceID: 102
      }
    ]);
  });

  it('should show api error on get error', () => {
    interfaceBrowserService.carrierInterfaceMapping.and.returnValue(
      throwError('err')
    );
    component.getTableDatas();
    expect(commonService.showAPIError).toHaveBeenCalled();
  });

});
