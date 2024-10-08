/* eslint-disable max-len */
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintGatewaysCarrierComponent } from './maint-gateways-carrier.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'src/app/shared/http-loader-factory';
import { MessageService, SelectItem } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { TranslateInternalService } from 'src/app/services/translate-internal.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaintGatewaysCarrierModule } from '../../maint-gateways-carrier.module';
import { Observable, Subscription, async, of, throwError } from 'rxjs';
import { PreferencesService } from 'src/app/services/preferences.service';
import { CMaintenanceByCarrierOptionsData, CMaintenanceByGatewayOptionsData, ECommandKey, IDataCarrier, IEmitActionTable, IEventPickList, ILastRunQueryData, IMaintenance, IRunType, IStatevalues } from '../../models/maint-gateways-carrier';
import { MaintGatewaysCarrierService } from '../../services/maint-gateways-carrier.service';
import { CommonService } from 'src/app/services/common.service';

describe('MaintGatewaysCarrierComponent', () => {
  let component: MaintGatewaysCarrierComponent;
  let fixture: ComponentFixture<MaintGatewaysCarrierComponent>;
  const translate = {
    translateResults: {
      MAI_GATE_WAYS_CARRIER: {
        FIELD_LABEL: {
          AVAILABLE_CARRIER_NAMES: 'Available Carrier Names',
          SELECTED_CARRIER_NAMES: 'Selected Carrier Names',
          GATEWAY_NAME: 'Gateway Name',
          SELECT_GATEWAY: 'Select Gateway',
          MAINTENANCE_ACTION: 'Maintenance Action',
          WHEN_QUERYING_SHOW: 'When Querying Show',
          ENDPOINT_RANGE: 'Endpoint Range',
          ALL_CARRIERS: 'All Carriers',
          CARRIERS: 'Carriers',
          TOTAL_ENDPOINT: 'Total Endpoint',
          SELECT_STATE: 'Select State'
        },
        HEADER_ACTION: 'Actions + Queries',
        HEADER_DETAILS: 'Details',
        HEADER: {
          CARRIER_NAMES: 'Carrier Names',
          COLUMNS: {
            ENDPOINT_NUMBER: 'Endpoint Number',
            STATE: 'State'
          }
        },
        ERROR_MESSAGES: {
          GATEWAYNAME_REQUIRED: 'Please select an available gateway, and try again.',
          MAINTENANCEACTION_REQUIRED: 'Please select a maintenance action, and try again.',
          ENDPOINTRANGE_REQUIRED: 'Endpoint range is invalid, please modify it and try again.',
          FILTERSTATE_REQUIRED: 'Please select a state, and try again.',
          SHOWDETAILS_REQUIRED: 'Show Details is invalid',
          INPUT_INVALID: 'Input invalid'
        },
        CONFIRMATION_ACTIONS: {
          TITLE: 'Confirmation',
          CONTENT_ALL_TRUNK: 'Are you sure you want to do this action?<br><br>[Action] {{action}}<br>[Range] All trunk members will be queried<br>It might take some time to complete.<br><br>Do you want to continue?',
          CONTENT: 'Are you sure you want to do this action?<br><br>[Action] <br>[Range] All trunk members will be queried<br>It might take some time to complete.<br><br>Do you want to continue?'
        }
      },
      COMMON: {
        SHOW_DETAILS: 'Show Details'
      },
      LAST_REFRESHED: 'Last Refreshed',
      NOTE_FORCE_RELEASE: 'FRLS operations has service affecting impact. Enter a endpoint range value (endpoints must be separated by commas; for instance 1,3,5,10)',
      NOTE_ENDPOINT_RANGE: 'To display all: 0- <br /> For a specific range: 2030-2050 <br> For specific endpoints: 2049, 2050 <br> For specific endpoint= 2049 <br> For a combination of range and specific endpoint: 2049-2052,2054'
    }
  };
  const activatedRouteMock = {
    snapshot: { data: { data: { typeMaintenance: 'BY_GATEWAYS' } } }
  };

  const preferencesService = {
    autoRefreshEmit: of(true)
  };

  const maintGatewaysCarrierService = {
    genericCommandToPerformMaintenanceOrQuerying: () => of(Observable<any>)
  };

  const commonService = jasmine.createSpyObj('commonService', ['showErrorMessage', 'showAPIError']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MaintGatewaysCarrierComponent],
      imports: [
        HttpClientModule,
        BrowserAnimationsModule,
        // FormsModule,
        // AccordionModule,
        // ReactiveFormsModule,
        MaintGatewaysCarrierModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        })
      ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        MessageService,
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: PreferencesService, useValue: preferencesService },
        { provide: TranslateInternalService, useValue: translate },
        { provide: CommonService, useValue: commonService },
        { provide: MaintGatewaysCarrierService, useValue: maintGatewaysCarrierService }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(MaintGatewaysCarrierComponent);
    component = fixture.componentInstance;
    component.showSummary = true;
    component.showDetail = true;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be call handleInitCols with MaintenanceAction = PostByGatewayName', () => {
    component.formGroup.controls['MaintenanceAction'].setValue('PostByGatewayName');
    component.handleInitCols();
    expect(component.showDetailCols).toBe(true);
  });

  it('should be call handleInitCols with MaintenanceAction = QESByGatewayName', () => {
    component.formGroup.controls['MaintenanceAction'].setValue('QESByGatewayName');
    component.handleInitCols();
    expect(component.showDetailCols).toBe(false);
  });

  it('should call changeCarrierNames', () => {
    spyOn(component, 'handleFormActionsQueriesValueChanges');

    const mockEvent: IEventPickList = {
      target: [
        { CarrierNames: 'Carrier3', GatewayName: 'Gateway2', GWCName: 'GWC2' }
      ],
      source: [],
      pickListName: ''
    };
    component.changeCarrierNames(mockEvent);
    expect(component.dataCarrierTarget).toEqual([
      { CarrierNames: 'Carrier3', GatewayName: 'Gateway2', GWCName: 'GWC2' }
    ]);
  });

  it('should call handleClear', () => {
    component.showSummary = true;
    component.showDetail = true;
    component.dataCarrierSource = [{ CarrierNames: 'Carrier1', GatewayName: 'Gateway1', GWCName: 'GWC1' }];
    component.dataCarrierTarget = [{ CarrierNames: 'Carrier2', GatewayName: 'Gateway2', GWCName: 'GWC2' }];

    component.handleClear();

    expect(component.showSummary).toBe(false);
    expect(component.showDetail).toBe(false);
    expect(component.dataCarrierSource.length).toBe(0);
    expect(component.dataCarrierTarget.length).toBe(0);
  });

  it('should call callActionTable', () => {
    spyOn(component, 'handleRun');
    const mockEvent: IEmitActionTable = {
      endpointNumbers: '',
      action: ECommandKey.BSYByCarrier
    };
    component.callActionTable(mockEvent);
    expect(component.handleRun).toHaveBeenCalled();
  });

  it('should call callActionTable', () => {
    spyOn(component, 'handleRun');
    const mockEvent: IEmitActionTable = {
      endpointNumbers: '',
      action: ECommandKey.BSYByCarrier
    };
    component.callActionTable(mockEvent);

    expect(component.handleRun).toHaveBeenCalled();
  });

  it('should call onFormSubmit true', () => {
    spyOn(component, 'checkValidation');
    component.onFormSubmit(true);
    expect(component.checkValidation).toHaveBeenCalled();
  });

  it('should call onFormSubmit false', () => {
    spyOn(component, 'handleClear');
    component.onFormSubmit(false);
    expect(component.handleClear).toHaveBeenCalled();
  });

  it('should call handleConfirmAction true', () => {
    spyOn(component, 'handleRun');
    component.handleConfirmAction(true);
    expect(component.handleRun).toHaveBeenCalled();
    expect(component.showConfirmActions).toBeFalsy();
  });

  it('should call handleConfirmAction false', () => {
    component.handleConfirmAction(false);
    expect(component.showConfirmActions).toBeFalsy();
  });

  it('should call getTotalEndpoint false', () => {
    const stateValue: IStatevalues[] = [
      { Value: '', Count: 10 },
      { Value: '', Count: 15 },
      { Value: '', Count: 5 }
    ];
    const action = 'QES_BY_GATEWAY_NAME';
    const expectedEndpoint = 30;
    const endpoint = component.getTotalEndpoint(stateValue);
    expect(endpoint).toBe(expectedEndpoint);
  });

  it('should call getTotalEndpoint false', () => {
    const stateValue: IStatevalues[] = [];
    const action = 'QES_BY_GATEWAY_NAME';
    const expectedEndpoint = 0;
    const endpoint = component.getTotalEndpoint(stateValue);
    expect(endpoint).toBe(expectedEndpoint);
  });

  it('should call getLabelForm success', () => {
    const options: SelectItem[] = [
      { label: 'label', value: 'valueFind' }
    ];
    const value = 'valueFind';
    const label = component.getLabelForm(options, value);
    expect(label).toBe('label');
  });

  it('should call getLabelForm fails', () => {
    const options: SelectItem[] = [];
    const value = '';
    const label = component.getLabelForm(options, value);
    expect(label).toBe('');
  });

  it('should call onTabOpen with index = 0', () => {
    const dataEvent = { index: 0 };
    component.onTabOpen(dataEvent);
    expect(component.selectAccord).toBe(true);
  });

  it('should call onTabOpen with index != 0', () => {
    const dataEvent = { index: 1 };
    component.onTabOpen(dataEvent);
    expect(component.selectAccord).toBe(false);
  });

  it('should call setDataCarrierSource is empty', () => {
    const carriers: IDataCarrier[] = [];
    component.setDataCarrierSource(carriers);
    expect(component.dataCarrierSource).toEqual([]);
  });

  it('should call setDataCarrierSource is empty', () => {
    const carriers: IDataCarrier[] = [];
    component.setDataCarrierSource(carriers);
    expect(component.dataCarrierSource).toEqual([]);
  });

  it('should call setDataCarrierSource is one element', () => {
    const carriers: IDataCarrier[] = [
      { CarrierNames: 'Carrier1', GatewayName: 'Gateway1', GWCName: 'GWC1' }
    ];
    component.setDataCarrierSource(carriers);
    expect(component.dataCarrierSource).toEqual([{ CarrierNames: 'Carrier1', GatewayName: 'Gateway1', GWCName: 'GWC1' }]);
  });

  it('should call setDataCarrierSource is more than one element', () => {
    const carriers: IDataCarrier[] = [
      { CarrierNames: 'Carrier1,Carrier2', GatewayName: 'Gateway1', GWCName: 'GWC1' },
      { CarrierNames: 'Carrier2', GatewayName: 'Gateway2', GWCName: 'GWC2' }
    ];
    component.setDataCarrierSource(carriers);
    expect(component.dataCarrierSource).toEqual([{ CarrierNames: 'Carrier1', GatewayName: 'Gateway1', GWCName: 'GWC1' },
      { CarrierNames: 'Carrier2', GatewayName: 'Gateway1', GWCName: 'GWC1' },
      { CarrierNames: 'Carrier2', GatewayName: 'Gateway2', GWCName: 'GWC2' }]);
  });

  it('should be call changeMaintenanceAction', () => {
    const maintenanceAction: ECommandKey = ECommandKey.FRLSByGatewayName;
    component.changeMaintenanceAction(maintenanceAction);
    expect(component.formGroup?.get('FilterState')?.disabled).toBe(true);

  });

  it('should enable FilterState control for other MaintenanceActions', () => {
    const maintenanceAction: ECommandKey = ECommandKey.QESByGatewayName;
    component.formGroup.get('FilterState')?.disable();
    component.changeMaintenanceAction(maintenanceAction);

    const filterStateControl = component.formGroup.get('FilterState');
    expect(filterStateControl).toBeTruthy();
    if (filterStateControl) {
      expect(filterStateControl.enabled).toBe(true);
    }
  });

  it('should call changeGatewayNames', () => {
    const initialCarriersData = [
      { CarrierNames: 'Carrier1', GatewayName: 'Gateway1', GWCName: 'GWC1' },
      { CarrierNames: 'Carrier2', GatewayName: 'Gateway2', GWCName: 'GWC2' },
      { CarrierNames: 'Carrier3', GatewayName: 'Gateway1', GWCName: 'GWC1' }
    ];
    component.carriersData = initialCarriersData;
    component.formGroup.get('GatewayName')?.setValue('Gateway2');

    component.changeGatewayNames();
    expect(component.dataCarrierTarget.length).toBe(0);
    expect(component.dataCarrierSource.length).toBe(1);
    expect(component.dataCarrierSource[0]).toEqual({
      CarrierNames: 'Carrier2',
      GatewayName: 'Gateway2',
      GWCName: 'GWC2'
    });
  });

  it('should be call setAutoRefresh', () => {
    spyOn(component, 'removeRefresh');
    spyOn(component, 'handleRun');
    const queryData: ILastRunQueryData = {
      command: ECommandKey.QESByGatewayName,
      dataBody: [],
      sSecurityInfo: ''
    };
    component.setAutoRefresh(queryData);
    expect(component.removeRefresh).toHaveBeenCalled();
  });

  it('should be call handleFormActionsQueriesValueChanges', () => {
    const mockSubscription: Partial<Subscription> = {
      unsubscribe: jasmine.createSpy('unsubscribe')
    };
    component.autoRefreshSubscription = mockSubscription as Subscription;
    component.removeRefresh();
    expect(mockSubscription.unsubscribe).toHaveBeenCalled();
  });

  it('should be call handleFormActionsQueriesValueChanges', () => {
    spyOn(component, 'removeRefresh');
    component.handleFormActionsQueriesValueChanges();
    expect(component.removeRefresh).toHaveBeenCalled();
  });

  it('should be call handleRefreshTable', () => {
    spyOn(component, 'handleRun');
    component.handleRefreshTable();
    expect(component.handleRun).toHaveBeenCalled();
  });

  it('should set summary data correctly when provided with state values', () => {
    const stateValues: IStatevalues[] = [
      { Count: 10, Value: 10 },
      { Count: 20, Value: 20 }
    ];
    component.setSummaryData(stateValues);
    expect(component.summaryData.state.values).toEqual(stateValues);
    const totalValue = stateValues.reduce((total, state) => total + state.Value, 0);
    expect(component.summaryData.state.totalEndpoint.value).toEqual(totalValue);
  });

  it('should call setSummaryData', () => {
    const gatewayName = '';
    const maintenanceAction = 'Query Endpoint State';
    const endpointRange = '0-';
    const filterState = 'All States';
    const carriers = 0;

    component.setSummaryData();

    expect(component.summaryData.query.gatewayName.value).toBe(gatewayName);
    expect(component.summaryData.query.maintenanceAction.value).toBe(maintenanceAction);
    expect(component.summaryData.query.endpointRange.value).toBe(endpointRange);
    expect(component.summaryData.query.filterState.value).toBe(filterState);
    expect(component.summaryData.query.carriers.value).toBe(carriers);
  });

  it('should call setSummaryData have actionTableData', () => {
    const gatewayName = '';
    const maintenanceAction = 'Query Endpoint State';
    const endpointRange = '0-';
    const filterState = 'All States';
    const carriers = 0;
    component.setSummaryData();
    expect(component.summaryData.query.gatewayName.value).toBe(gatewayName);
    expect(component.summaryData.query.maintenanceAction.value).toBe(maintenanceAction);
    expect(component.summaryData.query.endpointRange.value).toBe(endpointRange);
    expect(component.summaryData.query.filterState.value).toBe(filterState);
    expect(component.summaryData.query.carriers.value).toBe(carriers);
  });

  it('should call getCarrierNames', () => {
    const key = 'GetCarriers';
    const carriersResponse = {
      [key]: {
        Carriers: [
          { CarrierNames: 'Carrier1', GatewayName: 'Gateway1', GWCName: 'GWC1' },
          { CarrierNames: 'Carrier2', GatewayName: 'Gateway2', GWCName: 'GWC2' }
        ]
      }
    };
    spyOn(maintGatewaysCarrierService, 'genericCommandToPerformMaintenanceOrQuerying').and.returnValues(of(carriersResponse) as any);
    component.formGroup.patchValue({ GatewayName: 'Gateway1' });
    component.getCarrierNames();
    expect(component.carriersData.length).toBe(2);
    expect(component.carriersData[0].CarrierNames).toBe('Carrier1');
    expect(component.carriersData[1].CarrierNames).toBe('Carrier2');
  });

  it('should call getCarrierNames error', () => {
    spyOn(maintGatewaysCarrierService, 'genericCommandToPerformMaintenanceOrQuerying').and.returnValue(throwError('err'));
    component.getCarrierNames();
    expect(component.isInprocess).toBeFalsy();
  });

  it('should call getGatewayNames', () => {
    component.typeMaintenance = 'BY_CARRIER';
    const key = 'GetGatewayNames';
    const gatewayResponse: any = {
      GetGatewayNames: {
        Gateway: {
          Names: 'Gateway1,Gateway2,Gateway3'
        }

      }
    };
    spyOn(maintGatewaysCarrierService, 'genericCommandToPerformMaintenanceOrQuerying').and.returnValue(of(gatewayResponse));
    component.getGatewayNames();
    expect(component.gatewayNamesOptions.length).toBe(3);
    expect(component.gatewayNamesOptions[0].label).toBe('Gateway1');
    expect(component.gatewayNamesOptions[1].label).toBe('Gateway2');
    expect(component.gatewayNamesOptions[2].label).toBe('Gateway3');
  });

  it('should call getGatewayNames error', () => {
    spyOn(maintGatewaysCarrierService, 'genericCommandToPerformMaintenanceOrQuerying').and.returnValue(throwError('err'));
    component.getGatewayNames();
    expect(component.isInprocess).toBeFalsy();
  });

  it('should show an error message if form GatewayName is invalid', () => {
    component.formGroup.controls['GatewayName'].setValue('');
    component.formGroup.controls['MaintenanceAction'].setValue('a');
    component.formGroup.controls['EndpointRange'].setValue('0-');
    component.formGroup.controls['FilterState'].setValue('a');
    component.formGroup.controls['ShowDetails'].setValue(true);
    let errorMessage: string | undefined;
    commonService.showErrorMessage = (message: string) => {
      errorMessage = message;
    };
    component.checkValidation();
    expect(errorMessage).toBe(translate.translateResults.MAI_GATE_WAYS_CARRIER.ERROR_MESSAGES.GATEWAYNAME_REQUIRED);
  });

  it('should show an error message if form MaintenanceAction is invalid', () => {
    component.formGroup.controls['GatewayName'].setValue('GatewayName');
    component.formGroup.controls['MaintenanceAction'].setValue('');
    component.formGroup.controls['EndpointRange'].setValue('');
    component.formGroup.controls['FilterState'].setValue('');
    component.formGroup.controls['ShowDetails'].setValue(true);
    let errorMessage: string | undefined;
    commonService.showErrorMessage = (message: string) => {
      errorMessage = message;
    };
    component.checkValidation();
    expect(errorMessage).toBe(translate.translateResults.MAI_GATE_WAYS_CARRIER.ERROR_MESSAGES.MAINTENANCEACTION_REQUIRED);
  });

  it('should show an error message if form EndpointRange is invalid', () => {
    component.formGroup.controls['GatewayName'].setValue('GatewayName');
    component.formGroup.controls['MaintenanceAction'].setValue('MaintenanceAction');
    component.formGroup.controls['EndpointRange'].setValue('');
    component.formGroup.controls['FilterState'].setValue('');
    component.formGroup.controls['ShowDetails'].setValue(true);
    let errorMessage: string | undefined;
    commonService.showErrorMessage = (message: string) => {
      errorMessage = message;
    };
    component.checkValidation();
    expect(errorMessage).toBe(translate.translateResults.MAI_GATE_WAYS_CARRIER.ERROR_MESSAGES.ENDPOINTRANGE_REQUIRED);
  });

  it('should show an error message if form FilterState is invalid', () => {
    component.formGroup.controls['GatewayName'].setValue('GatewayName');
    component.formGroup.controls['MaintenanceAction'].setValue('MaintenanceAction');
    component.formGroup.controls['EndpointRange'].setValue('0-');
    component.formGroup.controls['FilterState'].setValue('');
    component.formGroup.controls['ShowDetails'].setValue(true);
    let errorMessage: string | undefined;
    commonService.showErrorMessage = (message: string) => {
      errorMessage = message;
    };
    component.checkValidation();
    expect(errorMessage).toBe(translate.translateResults.MAI_GATE_WAYS_CARRIER.ERROR_MESSAGES.FILTERSTATE_REQUIRED);
  });

  it('should show an error message if form ShowDetails is invalid', () => {
    component.formGroup.controls['GatewayName'].setValue('GatewayName');
    component.formGroup.controls['MaintenanceAction'].setValue('MaintenanceAction');
    component.formGroup.controls['EndpointRange'].setValue('0-');
    component.formGroup.controls['FilterState'].setValue('FilterState');
    component.formGroup.controls['ShowDetails'].setValue('');
    let errorMessage: string | undefined;
    commonService.showErrorMessage = (message: string) => {
      errorMessage = message;
    };
    component.checkValidation();
    expect(errorMessage).toBe(translate.translateResults.MAI_GATE_WAYS_CARRIER.ERROR_MESSAGES.SHOWDETAILS_REQUIRED);
  });

  it('should call checkValidation form not invalid', () => {
    const content = translate.translateResults.MAI_GATE_WAYS_CARRIER.CONFIRMATION_ACTIONS.CONTENT;
    sessionStorage.setItem('tmm_preferences', JSON.stringify({ confirmation: { checked: true } }));
    component.formGroup.controls['GatewayName'].setValue('a');
    component.formGroup.controls['MaintenanceAction'].setValue('a');
    component.formGroup.controls['EndpointRange'].setValue('0-');
    component.formGroup.controls['FilterState'].setValue('a');
    component.formGroup.controls['ShowDetails'].setValue(true);
    component.checkValidation();
    expect(component.dataConfirm.content).toBe(content);
  });

  it('should call checkValidation form not invalid and EndpointRange != -0', () => {
    const content = translate.translateResults.MAI_GATE_WAYS_CARRIER.CONFIRMATION_ACTIONS.CONTENT;
    sessionStorage.setItem('tmm_preferences', JSON.stringify({ confirmation: { checked: true } }));
    component.formGroup.controls['GatewayName'].setValue('a');
    component.formGroup.controls['MaintenanceAction'].setValue('a');
    component.formGroup.controls['EndpointRange'].setValue('1-');
    component.formGroup.controls['FilterState'].setValue('a');
    component.formGroup.controls['ShowDetails'].setValue(true);
    component.checkValidation();
    expect(component.dataConfirm.content).toBe(content);
  });

  it('should call checkValidation form not invalid and checked: false', () => {
    spyOn(component, 'handleRun');
    sessionStorage.setItem('tmm_preferences', JSON.stringify({ confirmation: { checked: false } }));
    component.formGroup.controls['GatewayName'].setValue('a');
    component.formGroup.controls['MaintenanceAction'].setValue('a');
    component.formGroup.controls['EndpointRange'].setValue('1-');
    component.formGroup.controls['FilterState'].setValue('a');
    component.formGroup.controls['ShowDetails'].setValue(true);

    component.checkValidation();
    expect(component.handleRun).toHaveBeenCalled();
  });

  it('should call getTempSubmitValue and actionNeedCallQESByCarrier = false', () => {
    const dataExpect = [
      { key: 'GatewayName', value: 'CO39G9PRI' },
      { key: 'EndpointRange', value: '0' },
      { key: 'ShowDetails', value: false },
      { key: 'FilterState', value: 'ALL' }];
    const dataSubmit = [
      { key: 'ShowDetails', value: false },
      { key: 'GatewayName', value: 'CO39G9PRI' },
      { key: 'EndpointRange', value: '0' }];
    const actionNeedCallQESByCarrier = false;
    const dataResponse = component.getTempSubmitValue(dataSubmit, actionNeedCallQESByCarrier);
    expect(dataResponse).toEqual(dataExpect);
  });

  it('should call getTempSubmitValue and actionNeedCallQESByCarrier = true', () => {
    const dataExpect = [
      { key: 'GatewayName', value: 'CO39G9PRI' },
      { key: 'EndpointRange', value: '0' },
      { key: 'ShowDetails', value: true },
      { key: 'FilterState', value: 'ALL' },
      { key: 'GWCName', value: 'GWC-2' },
      { key: 'CarrierNames', value: 'TDMs16c1f1/1/1/1,TDMs16c2f1/1/1/1' }
    ];
    const dataSubmit = [
      { key: 'CarrierNames', value: 'TDMs16c1f1/1/1/1,TDMs16c2f1/1/1/1' },
      { key: 'GWCName', value: 'GWC-2' },
      { key: 'ShowDetails', value: true },
      { key: 'GatewayName', value: 'CO39G9PRI' },
      { key: 'EndpointRange', value: '0' }];
    const actionNeedCallQESByCarrier = true;
    const dataResponse = component.getTempSubmitValue(dataSubmit, actionNeedCallQESByCarrier);
    expect(dataResponse).toEqual(dataExpect);
  });

  it('should call handleShowDetail', () => {
    spyOn(component, 'handleInitCols');
    const res: IMaintenance = {
      QESByGatewayName: {
        Header: {
          Summary: {
            State: [
              {
                'Value': 'UNKNOWN',
                'Count': 8
              },
              {
                'Value': 'MB  ',
                'Count': 19
              }
            ]
          },
          GatewayName: 'NETG9VMG36',
          FilterState: 'ALL',
          EndpointRange: '0-',
          NodeNumber: 41
        },
        Members: {
          Member: [{
            State: 'MB',
            TerminalNumber: 73
          }, {
            Error: {
              Number: 137,
              Message: 'The trunk member is not data filled. Verify data fill in table TRKGRP/TRKSGRP/TRKMEM for C20.',
              Severity: 'MAJOR'
            },
            TerminalNumber: 70
          },
          {
            Error: {
              Number: 5411,
              Message: 'The requested endpoints "2065" are not valid.',
              Severity: 'MAJOR'
            }
          }
          ]
        }
      }
    };
    const runType: IRunType = 'QUERIES' as any;
    const actionKey = 'QESByGatewayName';
    component.handleShowDetail(res, runType, actionKey);
    expect(component.handleInitCols).toHaveBeenCalled();
  });

  it('should call getCarrierNamesGWCNameSelected with dataCarrierTarget empty', () => {
    component.dataCarrierTarget = [];
    const result = component.getCarrierNamesGWCNameSelected();
    expect(result.carriers).toEqual([]);
    expect(result.gwcNames).toBe('');
  });

  it('should call getCarrierNamesGWCNameSelected', () => {
    component.dataCarrierTarget = [
      { CarrierNames: 'Carrier1', GatewayName: '', GWCName: 'GWC1' },
      { CarrierNames: 'Carrier2', GatewayName: '', GWCName: 'GWC2' }
    ];
    const result = component.getCarrierNamesGWCNameSelected();
    expect(result.carriers).toEqual(['Carrier1', 'Carrier2']);
    expect(result.gwcNames).toBe('GWC1');
  });

  it('should call getDataSubmit', () => {
    const dataSubmit = component.getDataSubmit();
    const expectedData = [
      { key: 'ShowDetails', value: false },
      { key: 'GatewayName', value: '' },
      { key: 'FilterState', value: 'ALL' },
      { key: 'EndpointRange', value: '0-' }
    ];
    expect(dataSubmit.length).toEqual(expectedData.length);
    expect(dataSubmit).toEqual(expectedData);
  });

  it('should call getDataSubmit and getCarrierNamesGWCNameSelected', () => {
    spyOn(component, 'getCarrierNamesGWCNameSelected').and.returnValues(
      {
        carriers: ['Carrier1', 'Carrier2'],
        gwcNames: 'GWC1'
      }
    );
    const expectedData = [
      {
        key: 'CarrierNames',
        value: 'Carrier1,Carrier2'
      },
      { key: 'GWCName', value: 'GWC1' },
      { key: 'ShowDetails', value: false },
      { key: 'GatewayName', value: '' },
      { key: 'FilterState', value: 'ALL' },
      { key: 'EndpointRange', value: '0-' }
    ];
    const dataSubmit = component.getDataSubmit();
    expect(dataSubmit.length).toEqual(expectedData.length);
    expect(dataSubmit).toEqual(expectedData);
  });

  it('should initialize maintenance options for BY_CARRIER', () => {
    component.typeMaintenance = 'BY_CARRIER';
    component.initMaintenanceOptions();
    expect(component.maintenanceOptions).toEqual([
      { label: CMaintenanceByCarrierOptionsData.QES_BY_CARRIER.label, value: CMaintenanceByCarrierOptionsData.QES_BY_CARRIER.value },
      { label: CMaintenanceByCarrierOptionsData.POST_BY_CARRIER.label, value: CMaintenanceByCarrierOptionsData.POST_BY_CARRIER.value },
      { label: CMaintenanceByCarrierOptionsData.BSY_BY_CARRIER.label, value: CMaintenanceByCarrierOptionsData.BSY_BY_CARRIER.value },
      { label: CMaintenanceByCarrierOptionsData.RTS_BY_CARRIER.label, value: CMaintenanceByCarrierOptionsData.RTS_BY_CARRIER.value },
      { label: CMaintenanceByCarrierOptionsData.FRLS_BY_CARRIER.label, value: CMaintenanceByCarrierOptionsData.FRLS_BY_CARRIER.value },
      { label: CMaintenanceByCarrierOptionsData.INB_BY_CARRIER.label, value: CMaintenanceByCarrierOptionsData.INB_BY_CARRIER.value }
    ]);
    expect(component.getFormFieldMaintenanceAction.value).toBe(CMaintenanceByCarrierOptionsData.QES_BY_CARRIER.value);
  });

  it('should initialize maintenance options for BY_GATEWAYS', () => {
    component.typeMaintenance = 'BY_GATEWAYS';
    component.initMaintenanceOptions();
    expect(component.maintenanceOptions).toEqual([
      { label: CMaintenanceByGatewayOptionsData.QES_BY_GATEWAY_NAME.label, value: CMaintenanceByGatewayOptionsData.QES_BY_GATEWAY_NAME.value },
      { label: CMaintenanceByGatewayOptionsData.POST_BY_GATEWAY_NAME.label, value: CMaintenanceByGatewayOptionsData.POST_BY_GATEWAY_NAME.value },
      { label: CMaintenanceByGatewayOptionsData.BSY_BY_GATEWAY_NAME.label, value: CMaintenanceByGatewayOptionsData.BSY_BY_GATEWAY_NAME.value },
      { label: CMaintenanceByGatewayOptionsData.RTS_BY_GATEWAY_NAME.label, value: CMaintenanceByGatewayOptionsData.RTS_BY_GATEWAY_NAME.value },
      { label: CMaintenanceByGatewayOptionsData.FRLS_BY_GATEWAY_NAME.label, value: CMaintenanceByGatewayOptionsData.FRLS_BY_GATEWAY_NAME.value },
      { label: CMaintenanceByGatewayOptionsData.INB_BY_GATEWAY_NAME.label, value: CMaintenanceByGatewayOptionsData.INB_BY_GATEWAY_NAME.value }
    ]);
    expect(component.getFormFieldMaintenanceAction.value).toBe(CMaintenanceByGatewayOptionsData.QES_BY_GATEWAY_NAME.value);
  });
});
