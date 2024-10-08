import { FilterTypes } from 'rbn-common-lib';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarriersComponent } from './carriers.component';
import { FormBuilder } from '@angular/forms';
import { GatewayControllersService } from '../../../services/gateway-controllers.service';
import { CommonService } from 'src/app/services/common.service';
import { TranslateInternalService } from 'src/app/services/translate-internal.service';
import { AppModule } from 'src/app/app.module';
import { TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of, throwError } from 'rxjs';
import { SafePipe } from 'src/app/shared/pipes/safe.pipe';
import { mapCarrierErrorType } from '../../../models/carriers';

describe('CarriersComponent', () => {
  let component: CarriersComponent;
  let fixture: ComponentFixture<CarriersComponent>;
  let fb: FormBuilder;
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
      GATEWAY_CONTROLLERS: {
        TITLE: 'Gateway Controllers',
        SELECT_GW: 'Select a Gateway Controller',
        UNIT_0: 'Unit 0',
        UNIT_1: 'Unit 1',
        PROVISIONING: {
          TITLE: 'Provisioning',
          TABS: {
            COMMON: {
              GATEWAY_LIST: 'Gateway List',
              RETRIEVAL_CRITERIA: 'Retrieval Criteria',
              LIMIT_RESULT: 'Limit Result',
              REPLACE_LIST: 'Replace List',
              APPEND_TO_LIST: 'Append to List',
              EMPTY_MSG: 'No Records Found',
              BTN: {
                RETRIEVE: 'Retrieve',
                RETRIEVE_ALL: 'Retrieve All'
              }
            },
            CARRIERS: {
              TITLE: 'Carriers',
              TABLE: {
                COLS: {
                  NAME: 'Name',
                  GATEWAY: 'Gateway',
                  GATEWAY_DOMAIN: 'Gateway Domain',
                  NODE_NUMBER: 'Node Number',
                  START_TERM: 'Start Term',
                  NUM_PORTS: 'Num Ports',
                  V52_IID: 'V5.2 IID',
                  V52_LINK_ID: 'V5.2 Link ID',
                  V5_UA_LINK_ID: 'V5 UA Link ID',
                  NFAS_DPNSS_IID: 'NFAS/DPNSS IID',
                  IUA_IID: 'IUA IID'
                }
              },
              ERROR: {
                TITLE: 'Carrier Data Retrieval Failure',
                MESSAGE: 'Endpoint data retrieval failed.',
                NUMERIC: 'Limit value must be numeric'
              },
              ADD: {
                ADD_BTN_LABEL: 'New Carrier',
                TITLE: 'Add New Carrier',
                CARRIER_NAME: 'Carrier Name',
                GATEWAY_NAME: 'Gateway Name',
                START_TERMINAL_NUM: 'Start Terminal Number',
                VOIP_VPN: 'VOIP VPN',
                H_323: 'H.323',
                PRI_DPNSS: 'PRI/DPNSS',
                NUMBER_OF_PORTS: 'Number of Ports',
                NFAS_DPNSS_IID: 'NFAS/DPNSS IID',
                IUA_IID: 'IUA IID',
                CHAR_STRING_INFO: 'Valid values: Character string',
                START_TERMINAL_NUM_INFO:
                  'Optional value used to specify starting position of a contiguous range of TNs',
                NUMBER_OF_PORTS_INFO:
                  'Optional value used to specify the number of TNs desired. Defaults to 24 or 32 if not filled.',
                NFAS_DPNSS_IID_INFO: 'Valid values: PVG (0-31), Others (0-63)',
                IUA_IID_INFO: 'Valid values: 1-2048',
                SUCCESS_TITLE: 'Add Carrier Successfully',
                SUCCESS_MESSAGE: 'Add Carrier successfully.',
                ERROR_TITLE: 'Add Carrier Failed',
                ERROR_MESSAGE:
                  'Addition of Carrier ${carrierName} to Gateway ${gatewayName} failed.'
              },
              DELETE: {
                CONFIRM_TITLE: 'Confirm Carrier Deletion',
                CONFIRM_MESSAGE:
                  'Are you sure that you want to delete the carrier ',
                SUCCESS_TITLE: 'Delete Carrier Successfully',
                SUCCESS_MESSAGE: 'Delete Carrier successfully.',
                ERROR_TITLE: 'Delete Carrier Failed',
                ERROR_MESSAGE_500:
                  'Deletion of Carrier ${carrierName} to Gateway ${gatewayName} failed.',
                ERROR_MESSAGE:
                  'Deletion of Carrier /{{carrierName}}/ on Gateway /{{gatewayName}}/ failed.<br>Delete Carrier Failed,' +
                  ' /{{errorMessage}}/',
                DEFAULT_ERROR_MESSAGE:
                  'Invalid return code ( /{{returnCode}}/ ) received in response to carrier operation.'
              }
            }
          }
        }
      }
    }
  };

  const commonService = jasmine.createSpyObj('commonService', [ 'showAPIError', 'showErrorMessage' ]);
  const gwcService = jasmine.createSpyObj('gwcService', [
    'getUnitStatus',
    'checkV52Supported',
    'getCarriersDataRetrive',
    'getCarriersDataRetriveAll',
    'getDisplayCarriersData',
    'getNodeNumber',
    'addCarrier',
    'deleteCarrier'
  ]);

  const getUnitStatusRes = {
    unit0ID: '10.254.166.26:161',
    unit0IPAddr: '10.254.166.26',
    unit0Port: 161,
    unit1ID: '10.254.166.27:161',
    unit1IPAddr: '10.254.166.27',
    unit1Port: 161
  };
  const retriveAllRes = {
    count: 2,
    crData: [
      {
        gatewayName: 'labpbxco39',
        gwHostname: 'labpbxco39',
        gwDefaultDomain: 'NOT_SET',
        carrierName: 'EPG_001',
        nodeNo: 42,
        firstTn: 1,
        noOfPorts: 2047,
        v52InterfaceId: -99,
        v52LinkId: -99,
        v5UALinkId: -99,
        priInterfaceId: 0,
        priIUAInterfaceId: -99
      },
      {
        gatewayName: 'CO39G9PRI',
        gwHostname: 'CO39G9PRI',
        gwDefaultDomain: 'NOT_SET',
        carrierName: 'TDMs16c2f1/1/1/1',
        nodeNo: 42,
        firstTn: 2073,
        noOfPorts: 24,
        v52InterfaceId: -99,
        v52LinkId: -99,
        v5UALinkId: -99,
        priInterfaceId: 0,
        priIUAInterfaceId: 2010
      }
    ]
  };
  const retriveRes = {
    count: 1,
    crData: [
      {
        gatewayName: 'CO39G9PRI',
        gwHostname: 'CO39G9PRI',
        gwDefaultDomain: 'NOT_SET',
        carrierName: 'TDMs16c2f1/1/1/1',
        nodeNo: 42,
        firstTn: 2073,
        noOfPorts: 24,
        v52InterfaceId: -99,
        v52LinkId: -99,
        v5UALinkId: -99,
        priInterfaceId: 0,
        priIUAInterfaceId: 2010
      }
    ]
  };
  const carrierRetrieveTableData = [
    {
      gatewayName: 'CO39G9PRI',
      gwHostname: 'CO39G9PRI',
      gwDefaultDomain: '',
      carrierName: 'TDMs16c2f1/1/1/1',
      nodeNo: 42,
      firstTn: 2073,
      noOfPorts: 24,
      v52InterfaceId: '',
      v52LinkId: '',
      v5UALinkId: '',
      priInterfaceId: 0,
      priIUAInterfaceId: 2010,
      dataExpand: [{}],
      order: (0).toString()
    }
  ];
  const carriersTableData = [
    {
      gatewayName: 'labpbxco39',
      gwHostname: 'labpbxco39',
      gwDefaultDomain: '',
      carrierName: 'EPG_001',
      nodeNo: 42,
      firstTn: 1,
      noOfPorts: 2047,
      v52InterfaceId: '',
      v52LinkId: '',
      v5UALinkId: '',
      priInterfaceId: 0,
      priIUAInterfaceId: '',
      dataExpand: [{}],
      order: (0).toString()
    },
    {
      gatewayName: 'CO39G9PRI',
      gwHostname: 'CO39G9PRI',
      gwDefaultDomain: '',
      carrierName: 'TDMs16c2f1/1/1/1',
      nodeNo: 42,
      firstTn: 2073,
      noOfPorts: 24,
      v52InterfaceId: '',
      v52LinkId: '',
      v5UALinkId: '',
      priInterfaceId: 0,
      priIUAInterfaceId: 2010,
      dataExpand: [{}],
      order: (1).toString()
    }
  ];
  const fetchChildEvent = {
    expanded: false,
    rowData: {
      carrierName: 'TDMs17c2f1/2/2/2',
      dataExpand: [{0: {}}],
      dropdownActions: [],
      firstTn: 32,
      gatewayName: 'G9GEN2CO32ISUP',
      gwDefaultDomain: '',
      gwHostname: 'G9GEN2CO32ISUP',
      noOfPorts: 31,
      nodeNo: 86,
      order: '0',
      priIUAInterfaceId: '',
      priInterfaceId: '',
      v5UALinkId: '',
      v52InterfaceId: '',
      v52LinkId: ''
    }
  };
  const getDisplayCarriersDataRes = {
    count: 31,
    epData: [
      {
        gwcID: '10.254.145.234:161',
        gatewayName: 'G9GEN2CO32ISUP',
        gwHostname: 'G9GEN2CO32ISUP',
        gwDefaultDomain: 'NOT_SET',
        endpointName: 'TDMs17c2f1/2/2/2/1',
        extNodeNumber: 86,
        extTerminalNumber: 32,
        endpointStatus: 'NOT_SET',
        iid: -1,
        endpointTNType: 5
      },
      {
        gwcID: '10.254.145.234:161',
        gatewayName: 'G9GEN2CO32ISUP',
        gwHostname: 'G9GEN2CO32ISUP',
        gwDefaultDomain: 'NOT_SET',
        endpointName: 'TDMs17c2f1/2/2/2/2',
        extNodeNumber: 86,
        extTerminalNumber: 33,
        endpointStatus: 'NOT_SET',
        iid: -1,
        endpointTNType: 5
      }
    ]
  };
  const getDisplayCarriersTableData = [
    {
      endpointName: 'TDMs17c2f1/2/2/2/1',
      extTerminalNumber: 32
    },
    {
      endpointName: 'TDMs17c2f1/2/2/2/2',
      extTerminalNumber: 33
    }
  ];
  const getNodeNumberRes = {
    count: 1,
    nodeList: [
      {
        gwcId: 'GWC-2',
        callServer: {
          name: 'CO39',
          cmMsgIpAddress: ''
        },
        elementManager: {
          ipAddress: '10.254.166.150',
          trapPort: 3162
        },
        serviceConfiguration: {
          gwcNodeNumber: 42,
          activeIpAddress: '10.254.166.24',
          inactiveIpAddress: '10.254.166.25',
          unit0IpAddress: '10.254.166.26',
          unit1IpAddress: '10.254.166.27',
          gwcProfileName: 'LINE_TRUNK_AUD_NA',
          capabilities: [
            {
              capability: { __value: 2 },
              capacity: 4094
            },
            {
              capability: { __value: 3 },
              capacity: 4096
            }
          ],
          bearerNetworkInstance: 'NET 2',
          bearerFabricType: 'IP',
          codecProfileName: 'default',
          execDataList: [
            {
              name: 'DPLEX',
              termtype: 'DPL_TERM'
            },
            {
              name: 'KSETEX',
              termtype: 'KEYSET'
            }
          ],
          defaultGwDomainName: ''
        },
        deviceList: []
      }
    ]
  };
  const addCarrierRes = {
    'firstTn': 2097,
    'noOfPorts': 24
  };
  const errorAddCarrier = {
    errorCode: '500',
    message: 'message = EndpointGroup invalid because the specified EndpointGroup'+
      ' name (TDMs17c1f1/2/2/2) is already in use on gateway (testcarrier). details = '
  };
  const messageContent = '200 OK';
  const deleteError = {
    errorCode: '500',
    message: 'message = Data not found in DB for EndpointGroup (testcarrier, TDMs17c1f1/2/2/2). details = '
  };


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarriersComponent, SafePipe ],
      providers: [
        { provide: GatewayControllersService, useValue: gwcService },
        { provide: CommonService, useValue: commonService },
        { provide: TranslateInternalService, useValue: translate },
        FormBuilder
      ],
      imports: [AppModule, TranslateModule.forRoot()],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CarriersComponent);
    component = fixture.componentInstance;
    fb = TestBed.inject(FormBuilder);
    component.retrieveForm = fb.group({
      limitResult: '',
      retrivalCriteria: '',
      radioButton: 'replaceList'
    });
    gwcService.getUnitStatus.and.returnValue(of(getUnitStatusRes));
    gwcService.checkV52Supported.and.returnValue(of(true));
    gwcService.getCarriersDataRetrive.and.returnValue(of(retriveRes));
    gwcService.getCarriersDataRetriveAll.and.returnValue(of(retriveAllRes));
    gwcService.getDisplayCarriersData.and.returnValue(of(getDisplayCarriersDataRes));
    gwcService.getNodeNumber.and.returnValue(of(getNodeNumberRes));
    gwcService.addCarrier.and.returnValue(of(addCarrierRes));
    gwcService.deleteCarrier.and.returnValue(of(0));
    component.gwcIp = getUnitStatusRes.unit0ID;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ngOnInit
  it('should load searchCarriersHistory from sessionStorage on ngOnInit', () => {
    const mockSearchCarriersHistory = ['item1', 'item2'];
    const stringifyMockedData = JSON.stringify(mockSearchCarriersHistory);
    spyOn(sessionStorage, 'getItem').and.returnValue(stringifyMockedData);

    component.ngOnInit();

    const expectedHistory = mockSearchCarriersHistory.map(item => ({ label: item, value: item }));
    expect(component.searchCarriersHistory).toEqual(JSON.parse(stringifyMockedData));
  });

  it('should enable numberOfPorts when voipVPN is checked', () => {
    component.addCarrierFormGroup.controls['voipVPN'].setValue(true);
    fixture.detectChanges();

    expect(component.isnumberOfPortsEnable).toBeTruthy();
    expect(component.addCarrierFormGroup.controls['noOfPorts'].enabled).toBeTruthy();
  });

  it('should disable numberOfPorts and reset its value when voipVPN is unchecked', () => {
    component.addCarrierFormGroup.controls['voipVPN'].setValue(false);
    fixture.detectChanges();

    expect(component.isnumberOfPortsEnable).toBeFalsy();
    expect(component.addCarrierFormGroup.controls['noOfPorts'].enabled).toBeFalsy();
    expect(component.addCarrierFormGroup.controls['noOfPorts'].value).toBeNull();
  });

  it('should enable numberOfPorts when h323 is checked', () => {
    component.addCarrierFormGroup.controls['h323'].setValue(true);
    fixture.detectChanges();

    expect(component.isnumberOfPortsEnable).toBeTruthy();
    expect(component.addCarrierFormGroup.controls['noOfPorts'].enabled).toBeTruthy();
  });

  it('should disable numberOfPorts and reset its value when h323 is unchecked', () => {
    component.addCarrierFormGroup.controls['h323'].setValue(false);
    fixture.detectChanges();

    expect(component.isnumberOfPortsEnable).toBeFalsy();
    expect(component.addCarrierFormGroup.controls['noOfPorts'].enabled).toBeFalsy();
    expect(component.addCarrierFormGroup.controls['noOfPorts'].value).toBeNull();
  });

  it('should enable numberOfPorts when priDpnss is checked', () => {
    component.addCarrierFormGroup.controls['priDpnss'].setValue(true);
    fixture.detectChanges();

    expect(component.isIIDsEnable).toBeTruthy();
    expect(component.addCarrierFormGroup.controls['priInterfaceId'].enabled).toBeTruthy();
    expect(component.addCarrierFormGroup.controls['priIUAInterfaceId'].enabled).toBeTruthy();
  });

  it('should disable numberOfPorts and reset its value when priDpnss is unchecked', () => {
    component.addCarrierFormGroup.controls['priDpnss'].setValue(false);
    fixture.detectChanges();

    expect(component.isIIDsEnable).toBeFalsy();
    expect(component.addCarrierFormGroup.controls['priInterfaceId'].enabled).toBeFalsy();
    expect(component.addCarrierFormGroup.controls['priInterfaceId'].value).toBeNull();
    expect(component.addCarrierFormGroup.controls['priIUAInterfaceId'].enabled).toBeFalsy();
    expect(component.addCarrierFormGroup.controls['priIUAInterfaceId'].value).toBeNull();
  });

  // checkV52Supported
  it('should checkV52Supported, returns false', () => {
    spyOn(component, 'initV52UnsupportCols');
    gwcService.checkV52Supported.and.returnValue(of(false));

    component.checkV52Supported();

    expect(component.initV52UnsupportCols).toHaveBeenCalled();
  });

  it('should checkV52Supported, returns error', () => {
    gwcService.checkV52Supported.and.returnValue(throwError('error'));

    component.checkV52Supported();

    expect(commonService.showAPIError).toHaveBeenCalledWith('error');
  });

  // initV52UnsupportCols
  it('should initV52UnsupportCols', () => {
    component.initV52UnsupportCols();

    expect(component.carriersTableCols).toBeDefined();
  });

  // ngOnChanges
  it('should handle ngOnChanges', () => {
    spyOn(component, 'checkV52Supported');
    const gwControllerName = 'GWC-0';

    component.gwControllerName = 'GWC-0';
    component.currentGwcName = 'GWC-0';
    component.isLoading = false;
    component.ngOnChanges();

    expect(gwcService.getUnitStatus).toHaveBeenCalledWith(gwControllerName);
    expect(component.isLoading).toBeFalsy();
    expect(component.gwcIp).toBe(getUnitStatusRes.unit0ID);
    expect(component.currentGwcName).toBe(gwControllerName);
    expect(component.checkV52Supported).toHaveBeenCalled();
  });

  it('ngOnChanges getUnitStatus handle error', () => {
    spyOn(component, 'checkV52Supported');
    gwcService.getUnitStatus.and.returnValue(throwError('error'));
    const gwControllerName = 'GWC-0';
    component.gwControllerName = 'GWC-0';

    component.ngOnChanges();

    expect(gwcService.getUnitStatus).toHaveBeenCalledWith(gwControllerName);
    expect(component.isLoading).toBe(false);
    expect(commonService.showAPIError).toHaveBeenCalledWith('error');
    expect(component.checkV52Supported).toHaveBeenCalled();
  });

  // onRetrieveHandle
  it('should handle onRetrieveHandle with event = true', () => {
    const event = true;
    component.retrieveForm.get('limitResult')?.setValue('abc');

    component.onRetrieveHandle(event);

    expect(commonService.showErrorMessage)
      .toHaveBeenCalledWith(translate.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.CARRIERS.ERROR.NUMERIC);
  });

  it('should handle onRetrieveHandle with event = true negative limit result', () => {
    const event = true;
    component.retrieveForm.get('limitResult')?.setValue('-10');

    component.onRetrieveHandle(event);

    expect(gwcService.getCarriersDataRetrive).toHaveBeenCalled();
  });

  it('should add a new item to searchCarriersHistory and update sessionStorage if criteria is valid, onRetrieveHandle', () => {
    const searchString = 'TDMs16c2f1/1/1/1';
    const maxReturnRows = '25';
    spyOn(component, 'isValueSearchedBefore').and.returnValue(false);
    const setItemSpy = spyOn(sessionStorage, 'setItem');

    component.retrieveForm.get('retrivalCriteria')?.setValue(searchString);
    component.retrieveForm.get('limitResult')?.setValue(maxReturnRows);
    component.onRetrieveHandle(true);

    expect(component.isValueSearchedBefore).toHaveBeenCalledWith(searchString);
    expect(setItemSpy).toHaveBeenCalledWith(
      'searchCarriersHistory',
      JSON.stringify(component.searchCarriersHistory)
    );
    expect(gwcService.getCarriersDataRetrive).toHaveBeenCalledWith(getUnitStatusRes.unit0ID, searchString, maxReturnRows);
    expect(component.carriersTableData).toEqual(carrierRetrieveTableData);
  });

  it('should handle onRetrieveHandle === false', () => {
    const event = false;
    const form = component.retrieveForm;

    component.onRetrieveHandle(event);

    expect(form.get('limitResult')?.value).toEqual('');
    expect(form.get('retrivalCriteria')?.value).toEqual('');
    expect(form.get('radioButton')?.value).toEqual('replaceList');
  });

  /* it('getCarriersDataRetrive handle error', () => {
    const event = true;
    component.retrieveForm.get('retrivalCriteria')?.setValue('');
    const errorData = {
      error: {
        errorCode: '500',
        message: 'message = error details = '
      }
    };
    gwcService.getCarriersDataRetrieve.and.returnValue(throwError(errorData));

    component.onRetrieveHandle(event);

    expect(gwcService.getCarriersDataRetrive).toHaveBeenCalled();
    expect(component.isLoading).toBe(false);
    expect(component.errorTitle).toEqual(translate.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.CARRIERS.ERROR.TITLE);
    expect(component.detailsText).toEqual('error ');
    expect(component.messageText).toEqual(translate.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.CARRIERS.ERROR.MESSAGE);
    expect(component.showErrorDialog).toBe(true);
  });*/

  // onRetriveAllHandle
  it('should retrieve all', () => {
    component.isLoading = true;

    component.onRetriveAllHandle();

    expect(gwcService.getCarriersDataRetriveAll).toHaveBeenCalledWith(getUnitStatusRes.unit0ID);
    expect(component.isLoading).toBeFalse();
    expect(component.carriersTableData).toEqual(carriersTableData);
  });

  it('should retrieve all with error', () => {
    gwcService.getCarriersDataRetriveAll.and.returnValue(throwError('error'));
    component.isLoading = true;

    component.onRetriveAllHandle();

    expect(gwcService.getCarriersDataRetriveAll).toHaveBeenCalledWith(getUnitStatusRes.unit0ID);
    expect(component.isLoading).toBeFalse();
    expect(commonService.showAPIError).toHaveBeenCalledWith('error');
  });

  // isValueSearchedBefore
  it('should return true if the value has been searched before', () => {
    const searchCarriersHistory = [
      { label: 'value1', value: 'value1' },
      { label: 'value2', value: 'value2' },
      { label: 'value3', value: 'value3' }
    ];

    component.searchCarriersHistory = searchCarriersHistory;

    const result = component.isValueSearchedBefore('value2');

    expect(result).toBe(true);
  });

  it('should return false if the value has not been searched before', () => {
    const searchCarriersHistory = [
      { label: 'value1', value: 'value1' },
      { label: 'value2', value: 'value2' },
      { label: 'value3', value: 'value3' }
    ];

    component.searchCarriersHistory = searchCarriersHistory;

    const result = component.isValueSearchedBefore('value4');

    expect(result).toBe(false);
  });

  // refreshCarriersTable()
  it('should call onRetrieveHandle when retrivalCriteria is not empty on refreshGatewaysTable', () => {
    component.retrieveForm.controls['retrivalCriteria'].setValue('abc');
    spyOn(component, 'onRetrieveHandle');

    component.refreshCarriersTable();

    expect(component.onRetrieveHandle).toHaveBeenCalled();
  });

  it('should not call onRetriveAllHandle when retrivalCriteria is empty on refreshGatewaysTable', () => {
    component.retrieveForm.controls['retrivalCriteria'].setValue(null);
    spyOn(component, 'onRetriveAllHandle');

    component.refreshCarriersTable();

    expect(component.onRetriveAllHandle).toHaveBeenCalled();
  });

  // Display Table
  // fetchChildItem()
  it('should call fetchChildItem() length is available', () => {
    spyOn(component, 'getChildrenTableData');
    component.carriersTableData = carriersTableData;

    component.fetchChildItem(fetchChildEvent);

    expect(component.getChildrenTableData).toHaveBeenCalled();
  });

  it('should set data property to an empty array for each element in the input array, removeDataColumn()', () => {
    const inputCols = [
      { data: [1, 2, 3] },
      { data: ['a', 'b', 'c'] },
      { data: [] },
      { otherProperty: 'someValue' }
    ];

    component.removeDataColumn(inputCols);

    expect(inputCols[0].data).toEqual([]);
    expect(inputCols[1].data).toEqual([]);
    expect(inputCols[2].data).toEqual([]);
    expect(inputCols[3].otherProperty).toBe('someValue');
  });

  // getChildrenTableData
  it('should call getDisplayCarriersData()', () => {
    component.colsChildren = [
      {
        data: [],
        field: 'endpointName',
        header: 'Name',
        options: {},
        colsEnable: true,
        sort: true,
        type: FilterTypes.InputText,
        autoSetWidth: true
      },
      {
        data: [],
        field: 'extTerminalNumber',
        header: 'Terminal Number',
        options: {},
        colsEnable: true,
        sort: true,
        type: FilterTypes.InputText,
        autoSetWidth: true
      }
    ];
    const gatewayName= 'G9GEN2CO32ISUP', carrierName= 'TDMs17c2f1/2/2/2';
    spyOn(component, 'removeDataColumn');

    component.getChildrenTableData(gatewayName, carrierName);

    expect(gwcService.getDisplayCarriersData).toHaveBeenCalledWith(component.gwcIp, gatewayName, carrierName);
    expect(component.isLoading).toBeFalse();
    expect(component.dataChildren).toEqual(getDisplayCarriersTableData);
    expect(component.removeDataColumn).toHaveBeenCalledWith(component.colsChildren);
  });

  it('should call getDisplayCarriersData() with error', () => {
    gwcService.getDisplayCarriersData.and.returnValue(throwError('error'));
    const gatewayName= '', carrierName= '';

    component.getChildrenTableData(gatewayName, carrierName);

    expect(gwcService.getDisplayCarriersData).toHaveBeenCalledWith(component.gwcIp, gatewayName, carrierName);
    expect(component.isLoading).toBeFalse();
    expect(commonService.showAPIError).toHaveBeenCalledWith('error');
  });

  // Add Carrier
  it('should call addNewCarrierBtn()', () => {
    component.addNewCarrierBtn();
    expect(component.showAddCarrier).toBeTrue();
  });

  // getNodeNumber
  it('should call getNodeNumber()', () => {
    component.gwControllerName = 'GWC-2';
    spyOn(component, 'addCarrier');

    component.getNodeNumber();

    expect(gwcService.getNodeNumber).toHaveBeenCalledWith(component.gwControllerName);
    expect(component.isLoading).toBeFalse();
    expect(component.addCarrier).toHaveBeenCalledWith(getNodeNumberRes.nodeList[0]?.serviceConfiguration?.gwcNodeNumber);
  });

  it('should call getNodeNumber() with error', () => {
    gwcService.getNodeNumber.and.returnValue(throwError('error'));
    component.gwControllerName = 'GWC-2';

    component.getNodeNumber();

    expect(gwcService.getNodeNumber).toHaveBeenCalledWith(component.gwControllerName);
    expect(component.isLoading).toBeFalse();
    expect(commonService.showAPIError).toHaveBeenCalledWith('error');
  });

  // add
  it('should call addCarrier() with voipVPN', () => {
    component.gwControllerName = 'GWC-2';
    const gwcNodeNumber = 42;
    component.addCarrierFormGroup.get('gatewayName')?.setValue('testcarrier');
    component.addCarrierFormGroup.get('carrierName')?.setValue('TDMs17c1f1/2/2/2');
    component.addCarrierFormGroup.get('voipVPN')?.setValue(true);

    spyOn(component, 'closeAddCarrier');
    spyOn(component, 'refreshCarriersTable');

    component.addCarrier(gwcNodeNumber);

    expect(gwcService.addCarrier).toHaveBeenCalled();
    expect(component.isLoading).toBeFalse();
    expect(component.showAddSuccessDialog).toBeTrue();
    expect(component.closeAddCarrier).toHaveBeenCalled();
    expect(component.refreshCarriersTable).toHaveBeenCalled();
  });

  it('should call addCarrier() with h323', () => {
    component.gwControllerName = 'GWC-2';
    const gwcNodeNumber = 42;
    component.addCarrierFormGroup.get('gatewayName')?.setValue('testcarrier');
    component.addCarrierFormGroup.get('carrierName')?.setValue('TDMs17c1f1/2/2/2');
    component.addCarrierFormGroup.get('h323')?.setValue(true);

    spyOn(component, 'closeAddCarrier');
    spyOn(component, 'refreshCarriersTable');

    component.addCarrier(gwcNodeNumber);

    expect(gwcService.addCarrier).toHaveBeenCalled();
    expect(component.isLoading).toBeFalse();
    expect(component.showAddSuccessDialog).toBeTrue();
    expect(component.closeAddCarrier).toHaveBeenCalled();
    expect(component.refreshCarriersTable).toHaveBeenCalled();
  });

  it('should call addCarrier() with priDpnss', () => {
    component.gwControllerName = 'GWC-2';
    const gwcNodeNumber = 42;
    component.addCarrierFormGroup.get('gatewayName')?.setValue('testcarrier');
    component.addCarrierFormGroup.get('carrierName')?.setValue('TDMs17c1f1/2/2/2');
    component.addCarrierFormGroup.get('priDpnss')?.setValue(true);

    spyOn(component, 'closeAddCarrier');
    spyOn(component, 'refreshCarriersTable');

    component.addCarrier(gwcNodeNumber);

    expect(gwcService.addCarrier).toHaveBeenCalled();
    expect(component.isLoading).toBeFalse();
    expect(component.showAddSuccessDialog).toBeTrue();
    expect(component.closeAddCarrier).toHaveBeenCalled();
    expect(component.refreshCarriersTable).toHaveBeenCalled();
  });

  it('should call addCarrier() with error and set messageText, detailsText, and errorTitle', () => {
    component.gwControllerName = 'GWC-2';
    const gwcNodeNumber = 42;
    component.addCarrierFormGroup.get('gatewayName')?.setValue('testcarrier');
    component.addCarrierFormGroup.get('carrierName')?.setValue('TDMs17c1f1/2/2/2');
    component.addCarrierFormGroup.get('priDpnss')?.setValue(true);
    gwcService.addCarrier.and.returnValue(throwError(errorAddCarrier));

    component.addCarrier(gwcNodeNumber);

    expect(gwcService.addCarrier).toHaveBeenCalled();
    expect(component.errorTitle).toBe(translate
      .translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.CARRIERS.ADD.ERROR_TITLE);
    expect(component.messageText).toBe(translate
      .translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.CARRIERS.ADD.ERROR_MESSAGE
      .replace('${carrierName}', component.addCarrierFormGroup.get('carrierName')?.value)
      .replace('${gatewayName}', component.addCarrierFormGroup.get('gatewayName')?.value));
    expect(component.showErrorDialog).toBe(true);
  });

  it('should call closeAddCarrier()', () => {
    component.closeAddCarrier();
    expect(component.showAddCarrier).toBeFalse();
  });

  // addCarrierFormFooterHandler
  it('should call addCarrierFormFooterHandler() with event=true', () => {
    spyOn(component, 'getNodeNumber');
    const event = true;

    component.addCarrierFormFooterHandler(event);

    expect(component.getNodeNumber).toHaveBeenCalled();
  });

  it('should call addCarrierFormFooterHandler() with event=false', () => {
    spyOn(component, 'closeAddCarrier');
    const event = false;

    component.addCarrierFormFooterHandler(event);

    expect(component.closeAddCarrier).toHaveBeenCalled();
  });

  it('should call closeAddSuccessDialog()', () => {
    component.closeAddSuccessDialog();

    expect(component.showAddSuccessDialog).toBeFalse();
  });

  it('should call closeErrorDialog()', () => {
    component.closeErrorDialog();

    expect(component.showErrorDialog).toBeFalse();
    expect(component.showDetailsBtn).toBeTrue();
  });

  it('should call showOrHideButtonClick()', () => {
    component.showDetailsBtn = true;
    component.showOrHideButtonClick();

    expect(component.showDetailsBtn).toBeFalse();
  });

  // Delete

  it('should call deleteCarrier() res = 0', () => {
    component.isLoading = true;
    component.deleteSelectedData = {
      gatewayName: 'testcarrier',
      carrierName: 'TDMs17c1f1/2/2/2'
    };
    spyOn(component, 'closeDeleteConfirmDialog');
    spyOn(component, 'refreshCarriersTable');

    component.deleteCarrier();

    expect(gwcService.deleteCarrier).toHaveBeenCalled();
    expect(component.isLoading).toBeFalse();
    expect(component.showDeleteSuccessDialog).toBeTrue();
    expect(component.closeDeleteConfirmDialog).toHaveBeenCalled();
    expect(component.refreshCarriersTable).toHaveBeenCalled();
  });

  it('should call deleteCarrier() res = 9', () => {
    component.isLoading = true;
    gwcService.deleteCarrier.and.returnValue(of(9));
    component.deleteSelectedData = {
      gatewayName: 'testcarrier',
      carrierName: 'TDMs17c1f1/2/2/2'
    };

    component.deleteCarrier();

    expect(gwcService.deleteCarrier).toHaveBeenCalled();
    expect(component.isLoading).toBeFalse();
    expect(component.deleteErrorTitle).toBe(translate
      .translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.CARRIERS.DELETE.ERROR_TITLE);
    expect(component.deleteMessageText).toBe(translate
      .translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.CARRIERS.DELETE.ERROR_MESSAGE
      .replace('/{{carrierName}}/', `${component.deleteSelectedData.carrierName}`)
      .replace('/{{gatewayName}}/', `${component.deleteSelectedData.gatewayName}`)
      .replace('/{{errorMessage}}/', `${mapCarrierErrorType[9]}`));
    expect(component.showDeleteErrorDialog).toBe(true);
  });

  it('should call deleteCarrier() res = 5', () => {
    component.isLoading = true;
    gwcService.deleteCarrier.and.returnValue(of(5));
    component.deleteSelectedData = {
      gatewayName: 'testcarrier',
      carrierName: 'TDMs17c1f1/2/2/2'
    };

    component.deleteCarrier();

    expect(gwcService.deleteCarrier).toHaveBeenCalled();
    expect(component.isLoading).toBeFalse();
    expect(component.deleteErrorTitle).toBe(translate
      .translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.CARRIERS.DELETE.ERROR_TITLE);
    expect(component.deleteMessageText).toBe(translate
      .translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.CARRIERS.DELETE.ERROR_MESSAGE
      .replace('/{{carrierName}}/', `${component.deleteSelectedData.carrierName}`)
      .replace('/{{gatewayName}}/', `${component.deleteSelectedData.gatewayName}`)
      .replace(', /{{errorMessage}}/', ''));
    expect(component.showDeleteErrorDialog).toBe(true);
  });

  it('should call deleteCarrier() res = 10', () => {
    component.isLoading = true;
    gwcService.deleteCarrier.and.returnValue(of(10));
    component.deleteSelectedData = {
      gatewayName: 'testcarrier',
      carrierName: 'TDMs17c1f1/2/2/2'
    };

    component.deleteCarrier();

    expect(gwcService.deleteCarrier).toHaveBeenCalled();
    expect(component.isLoading).toBeFalse();
    expect(component.deleteErrorTitle).toBe(translate
      .translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.CARRIERS.DELETE.ERROR_TITLE);
    expect(component.deleteMessageText).toBe(translate
      .translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.CARRIERS.DELETE.DEFAULT_ERROR_MESSAGE
      .replace('/{{returnCode}}/', '10'));
    expect(component.showDeleteErrorDialog).toBe(true);
  });

  it('should call deleteCarrier() with error', () => {
    component.isLoading = true;
    gwcService.deleteCarrier.and.returnValue(throwError(deleteError));
    component.deleteSelectedData = {
      gatewayName: 'testcarrier',
      carrierName: 'TDMs17c1f1/2/2/2'
    };

    component.deleteCarrier();

    expect(gwcService.deleteCarrier).toHaveBeenCalled();
    expect(component.isLoading).toBeFalse();
    expect(component.errorTitle).toBe(translate
      .translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.CARRIERS.DELETE.ERROR_TITLE);
    expect(component.messageText).toBe(translate
      .translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.CARRIERS.DELETE.ERROR_MESSAGE_500
      .replace('${carrierName}', `"${component.deleteSelectedData.carrierName}"`)
      .replace('${gatewayName}', `"${component.deleteSelectedData.gatewayName}"`));
    expect(component.showErrorDialog).toBe(true);
  });


  it('should call closeDeleteErrorDialog()', () => {
    spyOn(component, 'closeDeleteConfirmDialog');
    component.closeDeleteErrorDialog();

    expect(component.showDeleteErrorDialog).toBeFalse();
    expect(component.closeDeleteConfirmDialog).toHaveBeenCalled();
  });

  it('should call closeDeleteConfirmDialog()', () => {
    component.closeDeleteConfirmDialog();

    expect(component.showDeleteConfirmDialog).toBeFalse();
  });

  it('should call deleteDialogFooterHandler() with event=true', () => {
    spyOn(component, 'deleteCarrier');
    const event = true;

    component.deleteDialogFooterHandler(event);

    expect(component.deleteCarrier).toHaveBeenCalled();
  });

  it('should call deleteDialogFooterHandler() with event=false', () => {
    spyOn(component, 'closeDeleteConfirmDialog');
    const event = false;

    component.deleteDialogFooterHandler(event);

    expect(component.closeDeleteConfirmDialog).toHaveBeenCalled();
  });

  it('should call closeDeleteSuccessDialog()', () => {
    component.closeDeleteSuccessDialog();

    expect(component.showDeleteSuccessDialog).toBeFalse();
  });


});
