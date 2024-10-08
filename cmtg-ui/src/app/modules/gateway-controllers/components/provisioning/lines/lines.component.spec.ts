import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinesComponent } from './lines.component';
import { GatewayControllersService } from '../../../services/gateway-controllers.service';
import { CommonService } from 'src/app/services/common.service';
import { TranslateInternalService } from 'src/app/services/translate-internal.service';
import { FormBuilder } from '@angular/forms';
import { AppModule } from 'src/app/app.module';
import { TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of, throwError } from 'rxjs';
import { SafePipe } from 'src/app/shared/pipes/safe.pipe';

describe('LinesComponent', () => {
  let component: LinesComponent;
  let fixture: ComponentFixture<LinesComponent>;
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
            LINES: {
              TITLE: 'Lines',
              TABLE: {
                COLS: {
                  NAME: 'Name',
                  GATEWAY: 'Gateway',
                  GATEWAY_DOMAIN: 'Gateway Domain',
                  NODE_NUMBER: 'Node Number',
                  TERMINAL_NUMBER: 'Terminal Number',
                  ENDPOINT_TYPE: 'Endpoint Type'
                }
              },
              ERROR: {
                TITLE: 'Line Data Retrieval Failure',
                MESSAGE: 'Endpoint data retrieval failed.',
                NUMERIC: 'Limit value must be numeric'
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
    'getLinesDataRetrive',
    'getLinesDataRetriveAll'
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
    epData: [
      {
        gwcID: '10.254.166.26:161',
        gatewayName: 'GWC-1',
        gwHostname: 'GWC-1',
        gwDefaultDomain: 'NOT_SET',
        endpointName: 'EA11/000/0/0076',
        extNodeNumber: 1201,
        extTerminalNumber: 77,
        endpointStatus: 'NOT_SET',
        iid: -1,
        endpointTNType: 2
      },
      {
        gwcID: '10.254.166.26:161',
        gatewayName: 'GWC-1',
        gwHostname: 'GWC-1',
        gwDefaultDomain: 'NOT_SET',
        endpointName: 'EA11/000/0/0893',
        extNodeNumber: 1201,
        extTerminalNumber: 894,
        endpointStatus: 'NOT_SET',
        iid: -1,
        endpointTNType: 2
      }
    ]
  };
  const retriveRes = {
    count: 1,
    epData: [
      {
        gwcID: '10.254.166.26:161',
        gatewayName: 'G6G5CO39COMBO',
        gwHostname: 'G6G5CO39COMBO',
        gwDefaultDomain: 'NOT_SET',
        endpointName: 'ba/3',
        extNodeNumber: 255,
        extTerminalNumber: 3,
        endpointStatus: 'NOT_SET',
        iid: -1,
        endpointTNType: 1
      }
    ]
  };
  const linesRetrieveTableData = [
    {
      endpointName: 'ba/3',
      gatewayName: 'G6G5CO39COMBO',
      gwDefaultDomain: '',
      extNodeNumber: 255,
      extTerminalNumber: 3,
      endpointTNType: 'bri(1)'
    }
  ];
  const linesTableData = [
    {
      endpointName: 'EA11/000/0/0076',
      gatewayName: 'GWC-1',
      gwDefaultDomain: '',
      extNodeNumber: 1201,
      extTerminalNumber: 77,
      endpointTNType: 'pots(2)'
    },
    {
      endpointName: 'EA11/000/0/0893',
      gatewayName: 'GWC-1',
      gwDefaultDomain: '',
      extNodeNumber: 1201,
      extTerminalNumber: 894,
      endpointTNType: 'pots(2)'
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LinesComponent, SafePipe ],
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

    fixture = TestBed.createComponent(LinesComponent);
    component = fixture.componentInstance;
    fb = TestBed.inject(FormBuilder);
    component.retrieveForm = fb.group({
      limitResult: '',
      retrivalCriteria: '',
      radioButton: 'replaceList'
    });
    gwcService.getUnitStatus.and.returnValue(of(getUnitStatusRes));
    gwcService.getLinesDataRetrive.and.returnValue(of(retriveRes));
    gwcService.getLinesDataRetriveAll.and.returnValue(of(retriveAllRes));
    component.gwcIp = getUnitStatusRes.unit0ID;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle ngOnInit()', () => {
    const mockSearchLinesHistory = [{ label: 'string', value: 'string' }];
    spyOn( component, 'initCols' );
    spyOn(sessionStorage, 'getItem').and.returnValue(
      JSON.stringify(mockSearchLinesHistory)
    );

    component.ngOnInit();

    expect(component.initCols).toHaveBeenCalled();
    expect(sessionStorage.getItem).toHaveBeenCalledWith('searchLinesHistory');
    expect(component.searchLinesHistory).toEqual(mockSearchLinesHistory);
  });

  it('should handle ngOnChanges', () => {
    const gwControllerName = 'GWC-0';

    component.gwControllerName = 'GWC-0';
    component.currentGwcName = 'GWC-0';
    component.isLoading = false;
    component.ngOnChanges();

    expect(gwcService.getUnitStatus).toHaveBeenCalledWith(gwControllerName);
    expect(component.isLoading).toBeFalsy();
    expect(component.gwcIp).toBe(getUnitStatusRes.unit0ID);
    expect(component.currentGwcName).toBe(gwControllerName);
  });

  it('ngOnChanges getUnitStatus handle error', () => {
    gwcService.getUnitStatus.and.returnValue(throwError('error'));
    const gwControllerName = 'GWC-0';
    component.gwControllerName = 'GWC-0';

    component.ngOnChanges();

    expect(gwcService.getUnitStatus).toHaveBeenCalledWith(gwControllerName);
    expect(component.isLoading).toBe(false);
    expect(commonService.showAPIError).toHaveBeenCalledWith('error');
  });

  // onRetrieveHandle()
  it('should handle onRetrieveHandle with event = true', () => {
    const event = true;
    component.retrieveForm.get('limitResult')?.setValue('abc');

    component.onRetrieveHandle(event);

    expect(commonService.showErrorMessage)
      .toHaveBeenCalledWith(translate.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.LINES.ERROR.NUMERIC);
  });

  it('should handle onRetrieveHandle with event = true negative limit result', () => {
    const event = true;
    component.retrieveForm.get('limitResult')?.setValue('-10');

    component.onRetrieveHandle(event);

    expect(gwcService.getLinesDataRetrive).toHaveBeenCalled();
  });

  it('should add a new item to searchLinesHistory and update sessionStorage if criteria is valid', () => {
    const inputValue = 'test';
    const dummyValue = 'test';
    spyOn(component, 'isValueSearchedBefore').and.returnValue(false);
    const setItemSpy = spyOn(sessionStorage, 'setItem');

    component.retrieveForm.get('retrivalCriteria')?.setValue(dummyValue);
    component.retrieveForm.get('limitResult')?.setValue('25');
    component.onRetrieveHandle(true);

    expect(component.isValueSearchedBefore).toHaveBeenCalledWith(inputValue);
    expect(setItemSpy).toHaveBeenCalledWith(
      'searchLinesHistory',
      JSON.stringify(component.searchLinesHistory)
    );
    expect(gwcService.getLinesDataRetrive).toHaveBeenCalled();
    expect(component.linesTableData).toEqual(linesRetrieveTableData);
  });

  it('should handle onRetrieveHandle === false', () => {
    const event = false;
    const form = component.retrieveForm;
    spyOn(component, 'setDefaultValues');

    component.onRetrieveHandle(event);

    expect(form.get('limitResult')?.value).toEqual('');
    expect(form.get('retrivalCriteria')?.value).toEqual('');
    expect(form.get('radioButton')?.value).toEqual('replaceList');
    expect(component.setDefaultValues).toHaveBeenCalled();
  });

  it('getLinesDataRetrive handle error', () => {
    component.retrieveForm.get('retrivalCriteria')?.setValue('test');
    component.retrieveForm.get('limitResult')?.setValue('25');
    const errorData = {
      errorCode: '500',
      message: '"message = error details = "'
    };
    gwcService.getLinesDataRetrive.and.returnValue(throwError(errorData));
    const event = true;

    component.gwcIp = '';
    component.onRetrieveHandle(event);

    expect(gwcService.getLinesDataRetrive).toHaveBeenCalled();
    expect(component.isLoading).toBe(false);
    expect(component.titleText).toEqual(translate.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.LINES.ERROR.TITLE);
    expect(component.detailsText).toEqual('error ');
    expect(component.messageText).toEqual(translate.translateResults.GATEWAY_CONTROLLERS.PROVISIONING.TABS.LINES.ERROR.MESSAGE);
    expect(component.showRetrieveHandleErrorDialog).toBe(true);
  });

  it('should closeRetrieveHandleErrorDialog()', () => {

    component.closeRetrieveHandleErrorDialog();

    expect(component.showRetrieveHandleErrorDialog).toBeFalse();
    expect(component.showDetailsBtn).toBeTrue();
    expect(component.titleText).toEqual('');
    expect(component.messageText).toEqual('');
    expect(component.detailsText).toEqual('');
  });

  it('should showOrHideButtonClick()', () => {
    component.showDetailsBtn = true;

    component.showOrHideButtonClick();

    expect(component.showDetailsBtn).toBeFalse();
  });

  // onRetriveAllHandle()
  it('should retrieve all', () => {
    component.isLoading = true;

    component.onRetriveAllHandle();

    expect(gwcService.getLinesDataRetriveAll).toHaveBeenCalledWith(getUnitStatusRes.unit0ID);
    expect(component.isLoading).toBeFalse();
    expect(component.linesTableData).toEqual(linesTableData);
  });

  it('should retrieve all with error', () => {
    gwcService.getLinesDataRetriveAll.and.returnValue(throwError('error'));
    component.isLoading = true;

    component.onRetriveAllHandle();

    expect(gwcService.getLinesDataRetriveAll).toHaveBeenCalledWith(getUnitStatusRes.unit0ID);
    expect(component.isLoading).toBeFalse();
    expect(commonService.showAPIError).toHaveBeenCalledWith('error');
  });

  // isValueSearchedBefore
  it('should return true if the value has been searched before', () => {
    const searchLinesHistory = [
      { label: 'value1', value: 'value1' },
      { label: 'value2', value: 'value2' },
      { label: 'value3', value: 'value3' }
    ];

    component.searchLinesHistory = searchLinesHistory;

    const result = component.isValueSearchedBefore('value2');

    expect(result).toBe(true);
  });

  it('should return false if the value has not been searched before', () => {
    const searchLinesHistory = [
      { label: 'value1', value: 'value1' },
      { label: 'value2', value: 'value2' },
      { label: 'value3', value: 'value3' }
    ];

    component.searchLinesHistory = searchLinesHistory;

    const result = component.isValueSearchedBefore('value4');

    expect(result).toBe(false);
  });

  // refreshLinesTable()
  it('should call onRetrieveHandle when retrivalCriteria is not empty on refreshGatewaysTable', () => {
    component.retrieveForm.controls['retrivalCriteria'].setValue('abc');
    spyOn(component, 'onRetrieveHandle');

    component.refreshLinesTable();

    expect(component.onRetrieveHandle).toHaveBeenCalled();
  });

  it('should not call onRetriveAllHandle when retrivalCriteria is empty on refreshGatewaysTable', () => {
    component.retrieveForm.controls['retrivalCriteria'].setValue(null);
    spyOn(component, 'onRetriveAllHandle');

    component.refreshLinesTable();

    expect(component.onRetriveAllHandle).toHaveBeenCalled();
  });
});
