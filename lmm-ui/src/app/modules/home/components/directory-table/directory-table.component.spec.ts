import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject, of, throwError } from 'rxjs';

import { HomeModule } from '../../home.module';
import { DirectoryTableComponent } from './directory-table.component';
import { PreferencesService } from 'src/app/services/preferences.service';
import { TranslateInternalService } from 'src/app/services/translate-internal.service';
import { HomeService } from '../../services/home.service';
import { DirectoryService } from '../../services/directory.service';
import { ACTION_TYPES, IBulkActionsDirectory } from '../../models/home';
import { CommonService } from 'src/app/services/common.service';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

describe('DirectoryTableComponent', () => {
  let component: DirectoryTableComponent;
  let fixture: ComponentFixture<DirectoryTableComponent>;

  const preferencesService = jasmine.createSpyObj('preferencesService', [
    'startAutoRefresh',
    'stopAutoRefresh',
    'autoRefreshEmit$',
    'runAutoRefresh$'
  ]);
  const homeService = jasmine.createSpyObj('homeService', [
    'getMaintenance',
    'getLinePostInformation',
    'getEndpointStateInformation',
    'getLineInformationByTIDAndCLLI',
    'getLineInformationByDNAndCLLI',
    'getQdn',
    'getQsip',
    'getGateway',
    'getMiddleBoxIp',
    'getGateWayIp'
  ]);

  const directoryService = jasmine.createSpyObj('directoryService', [
    'storeDataTableStorage',
    'restoreDataTableFromStorage',
    'handleRowData',
    'dataTableChange$',
    'dataTable',
    'formatEndpointStateValue',
    'formatLineRequest',
    'getRowIndexByCMDN'
  ]);
  directoryService.dataTableChange$ = new Subject<boolean>();
  directoryService.dataTable = [];

  const commonService = jasmine.createSpyObj('commonService', [
    'showAPIError',
    'showErrorMessage',
    'getCurrentTime',
    'showSuccessMessage'
  ]);

  const router = { navigate: jasmine.createSpy('navigate') };

  const rowData = {
    cm_dn: '1038831001',
    clli: 'CO24',
    time: '14:17:12',
    cm_line_state: 'MB',
    endpoint_state: 'OK, ON-HOOK, POTS_TERM',
    profile: 'SIPVOICE',
    gw_address: '47.168.139.99',
    endpoint_name: 'aaln/6',
    cm_tid: '46.0.1',
    cm_gwc_address: '10.254.146.140',
    gw_name: 'co24mediatrix1124'
  };
  const responseLineInformationByTIDAndCLLI = {
    cm_dn: '1038831001',
    cm_len: 'LG 00 0 00 05',
    cm_lcc: 'IBN ',
    cm_tid: '46.0.1',
    cm_gwc_name: 'GWC    0',
    cm_gwc_address: '10.254.146.140',
    cm_clli: 'No',
    gw_name: 'co24mediatrix1124',
    gw_address: '47.168.139.99',
    gw_type: '',
    endpoint_name: 'aaln/6',
    cm_rc: '0',
    gw_rc: ''
  };

  const responseLineInformationByTIDAndCLLINotZero = {
    cm_dn: '1038831001',
    cm_len: 'LG 00 0 00 05',
    cm_lcc: 'IBN ',
    cm_tid: '46.0.1',
    cm_gwc_name: 'GWC    0',
    cm_gwc_address: '10.254.146.140',
    cm_clli: 'No',
    gw_name: 'co24mediatrix1124',
    gw_address: '47.168.139.99',
    gw_type: '',
    endpoint_name: 'aaln/6',
    cm_rc: '1',
    gw_rc: ''
  };

  const responseLineInformationByTIDAndCLLIAddressZero = {
    cm_dn: '1038831001',
    cm_len: 'LG 00 0 00 05',
    cm_lcc: 'IBN ',
    cm_tid: '46.0.1',
    cm_gwc_name: 'GWC    0',
    cm_gwc_address: '0.0.0.0',
    cm_clli: 'No',
    gw_name: 'co24mediatrix1124',
    gw_address: '47.168.139.99',
    gw_type: '',
    endpoint_name: 'aaln/6',
    cm_rc: '0',
    gw_rc: ''
  };

  preferencesService.autoRefreshEmit$ = new Subject<boolean>();
  preferencesService.runAutoRefresh$ = new Subject<boolean>();
  const translateInternalService = {
    translateResults: {
      HOME: {
        ACTION_TITLE: {},
        MTC_RC_ERRORS: {
          '7': 'Invalid state transition',
          '10': 'Deload Operation on the Line Failed',
          '8': 'Line is already in the requested state',
          '13': 'OSSDI communication timed out',
          '14': 'DMA fault (DMS Mtc Application on CBMg)',
          '15': 'BMU fault (Base Maintenance Utility on CBMg)',
          '20': 'No response from CM.',
          '21': 'BMU fault: \'CBMg Maintenance API not available.\'',
          '22': 'Could not send request to CM.',
          '17': 'Failed to seize line - please check GWC/LGRP state at {{CLLI}}',
          '18': 'Operation failed - GWC state is system busy at {{CLLI}}',
          '19': 'Operation failed - LGRP state is system busy at {{CLLI}}',
          '16': 'DDMS (on CBMg) error or CS not responding',
          '11': 'Unknown error',
          '4': 'Could not validate the TID.',
          '23': 'Can not communicate with CS.',
          '24': 'CBMg has not authorized LMM client. Re-configure CBMg to authorize SESM box as valid client!'
        },
        CM_RC_ERRORS: {
          2: 'Please check DN and try again',
          4: 'Could not validate the TID',
          7: 'Invalid state transition',
          8: 'Line is already in the requested state',
          9: 'Please enter the full 10 digit DN and try again',
          10: 'Deload Operation on the Line Failed',
          11: 'Unknown error',
          13: 'OSSDI communication timed out',
          14: 'DMA fault (DMS Mtc Application on CBMg)',
          15: 'BMU fault (Base Maintenance Utility on CBMg)',
          16: 'DDMS (on CBMg) error or CS not responding',
          17: 'Failed to seize line - please check GWC/LGRP state at {{CLLI}}',
          18: 'Operation failed - GWC state is system busy at {{CLLI}}',
          19: 'Operation failed - LGRP state is system busy at {{CLLI}}',
          20: 'No response from CM.',
          21: 'BMU fault: "CBMg Maintenance API not available."',
          22: 'Could not send request to CM',
          23: 'Can not communicate with CS',
          24: 'CBMg has not authorized LMM client. Re-configure CBMg to authorize SESM box as valid client!'
        },
        FRLS_WARNING: 'WARNING: Call processing will be affected. Continue?'
      }
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DirectoryTableComponent],
      imports: [HttpClientTestingModule, HomeModule, RouterTestingModule],
      providers: [
        { provide: PreferencesService, useValue: preferencesService },
        {
          provide: TranslateInternalService,
          useValue: translateInternalService
        },
        { provide: HomeService, useValue: homeService },
        { provide: DirectoryService, useValue: directoryService },
        { provide: CommonService, useValue: commonService },
        { provide: Router, useValue: router }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DirectoryTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call handleDisabledRefreshButton', () => {
    preferencesService.runAutoRefresh$.next(true);
    component.handleDisabledRefreshButton();
    expect(component?.tableConfig?.tableOptions?.disabledRefreshButton).toBe(
      true
    );
    expect(component.actions[0].disabled).toBe(true);

    preferencesService.runAutoRefresh$.next(false);
    component.handleDisabledRefreshButton();
    expect(component?.tableConfig?.tableOptions?.disabledRefreshButton).toBe(
      false
    );
    expect(component.actions[0].disabled).toBe(false);
  });

  it('should call handleAutoRefresh', () => {
    component.handleAutoRefresh();
    preferencesService.autoRefreshEmit$.next(true);
    expect(preferencesService.startAutoRefresh).toHaveBeenCalled();
  });

  it('should call ngOnDestroy', () => {
    component.ngOnDestroy();
    expect(preferencesService.stopAutoRefresh).toHaveBeenCalled();
  });

  it('should call callAction', () => {
    spyOn(component, 'actionMaintencance');
    spyOn(component, 'actionQdn');
    spyOn(component, 'actionQsip');
    spyOn(component, 'actionProperties');
    spyOn(component, 'clearRows');
    const ev: IBulkActionsDirectory = {
      label: 'BSY',
      value: 'BSY',
      description: '',
      type: ACTION_TYPES.MAINTENANCE_TYPE
    };
    const ev1: IBulkActionsDirectory = {
      label: 'RTS',
      value: 'RTS',
      description: '',
      type: ACTION_TYPES.MAINTENANCE_TYPE
    };
    const ev2: IBulkActionsDirectory = {
      label: 'FRLS',
      value: 'FRLS',
      description: '',
      type: ACTION_TYPES.MAINTENANCE_TYPE
    };
    const ev3: IBulkActionsDirectory = {
      label: 'INB',
      value: 'INB',
      description: '',
      type: ACTION_TYPES.MAINTENANCE_TYPE
    };
    const ev4: IBulkActionsDirectory = {
      label: 'QDN',
      value: 'QDN',
      description: '',
      type: ACTION_TYPES.QDN_TYPE
    };
    const ev5: IBulkActionsDirectory = {
      label: 'QSIP',
      value: 'QSIP',
      description: '',
      type: ACTION_TYPES.QSIP_TYPE
    };
    const ev6: IBulkActionsDirectory = {
      label: 'TEST',
      value: 'TEST',
      description: '',
      type: -1
    };
    const ev7: IBulkActionsDirectory = {
      label: 'Properties',
      value: 'PROPERTIES',
      description: '',
      type: ACTION_TYPES.PROPERTIES_TYPE
    };
    const ev8: IBulkActionsDirectory = {
      label: 'Clear',
      value: 'CLEAR',
      description: '',
      type: ACTION_TYPES.CLEAR
    };
    component.selectedRows = [rowData];
    component.callAction(ev);
    component.callAction(ev1);
    component.callAction(ev2);
    component.callAction(ev3);
    component.callAction(ev4);
    component.callAction(ev5);
    component.callAction(ev6);
    component.callAction(ev7);
    component.callAction(ev8);
    expect(component.actionMaintencance).toHaveBeenCalled();
    expect(component.actionQdn).toHaveBeenCalled();
    expect(component.actionQsip).toHaveBeenCalled();
    expect(component.actionProperties).toHaveBeenCalled();
    expect(component.clearRows).toHaveBeenCalled();
  });

  it('should call actionMaintencance', () => {
    homeService.getMaintenance.and.returnValue(of({ mtc_rc: '0' }));
    homeService.getLinePostInformation.and.returnValue(
      of({
        cm_line_state: 'MB',
        cm_connected_party: '',
        cm_dn: '1038831001',
        endpoint_state: '',
        cm_rc: '0',
        gw_rc: '',
        agcf_state: ''
      })
    );
    homeService.getEndpointStateInformation.and.returnValue(
      of({
        epState: 'OK',
        epInfo: '',
        op_rc: '1000',
        epCallState: 'ON-HOOK',
        epTerminalType: 'POTS_TERM',
        epStateDescription: 'Valid Audit response received from endpoint'
      })
    );
    const item = rowData;
    component.actionMaintencance('BSY', [item]);
    expect(homeService.getMaintenance).toHaveBeenCalled();
  });

  it('should call actionMaintencance case mtc_rc invaild, mtc_rc = 7', () => {
    homeService.getMaintenance.and.returnValue(of({ mtc_rc: '7' }));
    homeService.getLinePostInformation.and.returnValue(
      of({
        cm_line_state: 'MB',
        cm_connected_party: '',
        cm_dn: '1038831001',
        endpoint_state: '',
        cm_rc: '0',
        gw_rc: '',
        agcf_state: ''
      })
    );
    homeService.getEndpointStateInformation.and.returnValue(
      of({
        epState: 'OK',
        epInfo: '',
        op_rc: '1000',
        epCallState: 'ON-HOOK',
        epTerminalType: 'POTS_TERM',
        epStateDescription: 'Valid Audit response received from endpoint'
      })
    );
    const item = rowData;
    component.actionMaintencance('BSY', [item]);
    expect(homeService.getMaintenance).toHaveBeenCalled();
  });

  it('should call actionMaintencance case mtc_rc invaild, mtc_rc = -1', () => {
    homeService.getMaintenance.and.returnValue(of({ mtc_rc: '-1' }));
    homeService.getLinePostInformation.and.returnValue(
      of({
        cm_line_state: 'MB',
        cm_connected_party: '',
        cm_dn: '1038831001',
        endpoint_state: '',
        cm_rc: '0',
        gw_rc: '',
        agcf_state: ''
      })
    );
    homeService.getEndpointStateInformation.and.returnValue(
      of({
        epState: 'OK',
        epInfo: '',
        op_rc: '1000',
        epCallState: 'ON-HOOK',
        epTerminalType: 'POTS_TERM',
        epStateDescription: 'Valid Audit response received from endpoint'
      })
    );
    const item = rowData;
    component.actionMaintencance('BSY', [item]);
    expect(homeService.getMaintenance).toHaveBeenCalled();
  });

  it('should call actionMaintencance case call getMaintenance error', () => {
    homeService.getMaintenance.and.returnValue(throwError(''));
    homeService.getLinePostInformation.and.returnValue(
      of({
        cm_line_state: 'MB',
        cm_connected_party: '',
        cm_dn: '1038831001',
        endpoint_state: '',
        cm_rc: '0',
        gw_rc: '',
        agcf_state: ''
      })
    );
    homeService.getEndpointStateInformation.and.returnValue(
      of({
        epState: 'OK',
        epInfo: '',
        op_rc: '1000',
        epCallState: 'ON-HOOK',
        epTerminalType: 'POTS_TERM',
        epStateDescription: 'Valid Audit response received from endpoint'
      })
    );
    const item = rowData;
    component.actionMaintencance('BSY', [item]);
    expect(commonService.showAPIError).toHaveBeenCalled();
  });

  it('should call actionQdn', () => {

    homeService.getLineInformationByDNAndCLLI.and.returnValue(
      of(responseLineInformationByTIDAndCLLI)
    );
    homeService.getQdn.and.returnValue(
      of({
        DN: '8831400',
        TYPE: 'SINGLE PARTY LINE',
        SNPA: '103',
        SIG: 'DT',
        LNATTIDX: 'N/A'
      })
    );
    const item = rowData;
    component.actionQdn([item]);
    expect(homeService.getQdn).toHaveBeenCalled();
  });

  it('should call actionQsip', () => {
    homeService.getLineInformationByDNAndCLLI.and.returnValue(
      of(responseLineInformationByTIDAndCLLI)
    );
    homeService.getQsip.and.returnValue(
      of({
        cm_dn: '1038831508',
        cm_len: 'SS24 00 0 00 08',
        cm_lcc: 'IBN ',
        cm_tid: '29.0.9',
        cm_gwc_name: 'GWC 40',
        cm_gwc_address: '10.254.146.176',
        cm_clli: 'No',
        gw_name: 'sipvmgssl24',
        gw_address: '47.165.158.121',
        gw_type: '',
        endpoint_name: 'SS24/000/0/0008',
        cm_rc: '0',
        gw_rc: ''
      })
    );

    const item = rowData;
    component.actionQsip([item]);
    expect(homeService.getQsip).toHaveBeenCalled();
  });

  it('should call error message on callAction else situation', () => {
    spyOn(component, 'actionMaintencance');
    spyOn(component, 'clearSelectedOption');
    const ev: IBulkActionsDirectory = {
      label: 'BSY',
      value: 'BSY',
      description: '',
      type: ACTION_TYPES.MAINTENANCE_TYPE
    };
    component.selectedRows.push(rowData, rowData, rowData, rowData, rowData, rowData, rowData, rowData, rowData, rowData, rowData);
    component.callAction(ev);
    expect(commonService.showErrorMessage).toHaveBeenCalled();
    expect(component.clearSelectedOption).toHaveBeenCalled();
  });

  it('should equal 0 on clearRows when clear selected row', () => {
    directoryService.getRowIndexByCMDN.and.returnValue(0);
    spyOn(component, 'clearSelectedOption');
    const item = rowData;
    component.clearRows([item]);
    expect(directoryService.getRowIndexByCMDN).toHaveBeenCalledWith(item.cm_dn);
    expect(directoryService.dataTable.length).toBe(0);
    expect(component.clearSelectedOption).toHaveBeenCalled();
  });

  it('should call getGateWay api on actionProperties', () => {
    homeService.getLineInformationByDNAndCLLI.and.returnValue(
      of(responseLineInformationByTIDAndCLLI)
    );
    homeService.getGateway.and.returnValue(
      of({
        name: 'testgwc2',
        ipAddress: '0.0.0.0',
        type: 'small',
        extNodeNumber: 163,
        protocol: 'ncsprotocol',
        protVers: '1.0',
        protPort: 2948,
        heartbeat: 6,
        connSel: '0',
        profile: 45,
        pepServerName: 'NOT_SET',
        middleBoxName: 'NOT_SET',
        itransRootMiddleboxNames: [],
        algName: 'NOT_SET',
        defaultDomainName: 'NOT_SET',
        applicationData: []
      })
    );

    const item = rowData;
    component.actionProperties([item]);
    expect(homeService.getGateway).toHaveBeenCalled();
  });

  it('should call getMiddleBoxIp and getGateWayIp on actionProperties', () => {
    homeService.getLineInformationByDNAndCLLI.and.returnValue(
      of(responseLineInformationByTIDAndCLLI)
    );
    homeService.getGateway.and.returnValue(
      of({
        name: 'testgwc2',
        ipAddress: '0.0.0.0',
        type: 'small',
        extNodeNumber: 163,
        protocol: 'ncsprotocol',
        protVers: '1.0',
        protPort: 2948,
        heartbeat: 6,
        connSel: '0',
        profile: 45,
        pepServerName: 'NOT_SET',
        middleBoxName: 'TEST_SET',
        itransRootMiddleboxNames: [],
        algName: 'NOT_SET',
        defaultDomainName: 'NOT_SET',
        applicationData: []
      })
    );
    homeService.getMiddleBoxIp.and.returnValue(
      of('47.168.13.13')
    );
    homeService.getGateWayIp.and.returnValue(
      of('47.168.13.13')
    );

    const item = rowData;
    component.actionProperties([item]);
    expect(homeService.getMiddleBoxIp).toHaveBeenCalled();
    expect(homeService.getGateWayIp).toHaveBeenCalled();
  });

  it('should call error message on getLinePostInformation api-call on actionMaintenance', () => {
    homeService.getMaintenance.and.returnValue(of({ mtc_rc: '0' }));
    homeService.getLinePostInformation.and.returnValue(throwError(''));
    const item = rowData;
    component.actionMaintencance('BSY', [item]);
    expect(commonService.showAPIError).toHaveBeenCalled();
  });

  it('should call error message on getEndpointStateInformation api-call on actionMaintenance', () => {
    homeService.getMaintenance.and.returnValue(of({ mtc_rc: '0' }));
    homeService.getLinePostInformation.and.returnValue(
      of({
        cm_line_state: 'MB',
        cm_connected_party: '',
        cm_dn: '1038831001',
        endpoint_state: '',
        cm_rc: '0',
        gw_rc: '',
        agcf_state: ''
      })
    );
    homeService.getEndpointStateInformation.and.returnValue(throwError(''));
    const item = rowData;
    component.actionMaintencance('BSY', [item]);
    expect(commonService.showAPIError).toHaveBeenCalled();
  });

  it('should call error message on getLineInformationByDNAndCLLI api-call on  properties', () => {
    homeService.getLineInformationByDNAndCLLI.and.returnValue(throwError('error'));
    const item = rowData;
    component.actionProperties([item]);
    expect(commonService.showAPIError).toHaveBeenCalled();
  });

  it('should call error message on getGateway api-call on  properties', () => {
    homeService.getLineInformationByDNAndCLLI.and.returnValue(
      of(responseLineInformationByTIDAndCLLI)
    );
    homeService.getGateway.and.returnValue(throwError('error'));
    const item = rowData;
    component.actionProperties([item]);
    expect(homeService.getLineInformationByDNAndCLLI).toHaveBeenCalled();
    expect(commonService.showAPIError).toHaveBeenCalled();
  });

  it('should call error message on getMiddleBoxIp api-call on  properties', () => {
    homeService.getLineInformationByDNAndCLLI.and.returnValue(
      of(responseLineInformationByTIDAndCLLI)
    );
    homeService.getGateway.and.returnValue(
      of({
        name: 'testgwc2',
        ipAddress: '0.0.0.0',
        type: 'small',
        extNodeNumber: 163,
        protocol: 'ncsprotocol',
        protVers: '1.0',
        protPort: 2948,
        heartbeat: 6,
        connSel: '0',
        profile: 45,
        pepServerName: 'NOT_SET',
        middleBoxName: 'TEST_SET',
        itransRootMiddleboxNames: [],
        algName: 'NOT_SET',
        defaultDomainName: 'NOT_SET',
        applicationData: []
      })
    );
    homeService.getMiddleBoxIp.and.returnValue(throwError('error'));
    const item = rowData;
    component.actionProperties([item]);
    expect(homeService.getLineInformationByDNAndCLLI).toHaveBeenCalled();
    expect(homeService.getGateway).toHaveBeenCalled();
    expect(commonService.showAPIError).toHaveBeenCalled();
  });

  it('should call error message on getGateWayIp api-call on  properties', () => {
    homeService.getLineInformationByDNAndCLLI.and.returnValue(
      of(responseLineInformationByTIDAndCLLI)
    );
    homeService.getGateway.and.returnValue(
      of({
        name: 'testgwc2',
        ipAddress: '0.0.0.0',
        type: 'small',
        extNodeNumber: 163,
        protocol: 'ncsprotocol',
        protVers: '1.0',
        protPort: 2948,
        heartbeat: 6,
        connSel: '0',
        profile: 45,
        pepServerName: 'NOT_SET',
        middleBoxName: 'TEST_SET',
        itransRootMiddleboxNames: [],
        algName: 'NOT_SET',
        defaultDomainName: 'NOT_SET',
        applicationData: []
      })
    );
    homeService.getMiddleBoxIp.and.returnValue(
      of('0.0.0.0')
    );
    homeService.getGateWayIp.and.returnValue(throwError('error'));
    const item = rowData;
    component.actionProperties([item]);
    expect(homeService.getLineInformationByDNAndCLLI).toHaveBeenCalled();
    expect(homeService.getGateway).toHaveBeenCalled();
    expect(homeService.getMiddleBoxIp).toHaveBeenCalled();
    expect(commonService.showAPIError).toHaveBeenCalled();
  });

  it('should call error message when rc != 0 on properties', () => {
    homeService.getLineInformationByDNAndCLLI.and.returnValue(
      of(responseLineInformationByTIDAndCLLINotZero)
    );
    const item = rowData;
    component.actionProperties([item]);
    expect(homeService.getLineInformationByDNAndCLLI).toHaveBeenCalled();
    expect(commonService.showErrorMessage).toHaveBeenCalled();
  });

  it('should call error message when rc == 0 & address == 0.0.0.0 on properties', () => {
    spyOn(component, 'navigateDetailsPage');
    homeService.getLineInformationByDNAndCLLI.and.returnValue(
      of(responseLineInformationByTIDAndCLLIAddressZero)
    );
    const item = rowData;
    component.actionProperties([item]);
    expect(homeService.getLineInformationByDNAndCLLI).toHaveBeenCalled();
    expect(component.navigateDetailsPage).toHaveBeenCalled();
  });

  it('should call error message on getLineInformationByDNAndCLLI api-call on actionQdn', () => {
    homeService.getLineInformationByDNAndCLLI.and.returnValue(throwError('error'));
    const item = rowData;
    component.actionQdn([item]);
    expect(commonService.showAPIError).toHaveBeenCalled();
  });

  it('should call error message on getQdn api-call on actionQdn', () => {
    homeService.getLineInformationByDNAndCLLI.and.returnValue(
      of(responseLineInformationByTIDAndCLLI)
    );
    homeService.getQdn.and.returnValue(throwError('error'));
    const item = rowData;
    component.actionQdn([item]);
    expect(homeService.getLineInformationByDNAndCLLI).toHaveBeenCalled();
    expect(commonService.showAPIError).toHaveBeenCalled();
  });

  it('should call error message when rc != 0 on actionQdn', () => {
    homeService.getLineInformationByDNAndCLLI.and.returnValue(
      of(responseLineInformationByTIDAndCLLINotZero)
    );
    const item = rowData;
    component.actionQdn([item]);
    expect(homeService.getLineInformationByDNAndCLLI).toHaveBeenCalled();
    expect(commonService.showErrorMessage).toHaveBeenCalled();
  });

  it('should call error message on getLineInformationByDNAndCLLI api-call on actionQsip', () => {
    homeService.getLineInformationByDNAndCLLI.and.returnValue(throwError('error'));
    const item = rowData;
    component.actionQsip([item]);
    expect(commonService.showAPIError).toHaveBeenCalled();
  });

  it('should call error message on getQsip api-call on actionQsip', () => {
    homeService.getLineInformationByDNAndCLLI.and.returnValue(
      of(responseLineInformationByTIDAndCLLI)
    );
    homeService.getQsip.and.returnValue(throwError('error'));
    const item = rowData;
    component.actionQsip([item]);
    expect(homeService.getLineInformationByDNAndCLLI).toHaveBeenCalled();
    expect(commonService.showAPIError).toHaveBeenCalled();
  });

  it('should call error message when rc != 0 on actionQsip', () => {
    homeService.getLineInformationByDNAndCLLI.and.returnValue(
      of(responseLineInformationByTIDAndCLLINotZero)
    );
    const item = rowData;
    component.actionQsip([item]);
    expect(homeService.getLineInformationByDNAndCLLI).toHaveBeenCalled();
    expect(commonService.showErrorMessage).toHaveBeenCalled();
  });

  it('initActionColumn Refresh', () => {
    spyOn(component.refreshDN, 'emit');
    component.selectedRows = [rowData];
    component.initActionColumn();
    component.actions[0].onClick(component.selectedRows, 0);
    expect(component.refreshDN.emit).toHaveBeenCalled();
  });

  it('initActionColumn ClearRow', () => {
    spyOn(component, 'clearRows');
    component.selectedRows = [rowData];
    component.initActionColumn();
    component.actions[1].onClick(component.selectedRows, 0);
    expect(component.clearRows).toHaveBeenCalled();
  });

  it('initActionColumn Properties', () => {
    spyOn(component, 'actionProperties');
    component.selectedRows = [rowData];
    component.initActionColumn();
    component.actions[2].onClick(component.selectedRows, 0);
    expect(component.actionProperties).toHaveBeenCalled();
  });

  it('initActionColumn BSY', () => {
    spyOn(component, 'actionMaintencance');
    component.selectedRows = [rowData];
    component.initActionColumn();
    component.actions[3].onClick(component.selectedRows, 0);
    expect(component.actionMaintencance).toHaveBeenCalled();
  });

  it('initActionColumn RTS', () => {
    spyOn(component, 'actionMaintencance');
    component.selectedRows = [rowData];
    component.initActionColumn();
    component.actions[4].onClick(component.selectedRows, 0);
    expect(component.actionMaintencance).toHaveBeenCalled();
  });

  it('initActionColumn FRLS', () => {
    spyOn(component, 'warningDialog');
    component.selectedRows = [rowData];
    component.initActionColumn();
    component.actions[5].onClick(component.selectedRows, 0);
    expect(component.warningDialog).toHaveBeenCalled();
  });

  it('initActionColumn INB', () => {
    spyOn(component, 'actionMaintencance');
    component.selectedRows = [rowData];
    component.initActionColumn();
    component.actions[6].onClick(component.selectedRows, 0);
    expect(component.actionMaintencance).toHaveBeenCalled();
  });

  it('initActionColumn QDN', () => {
    spyOn(component, 'actionQdn');
    component.selectedRows = [rowData];
    component.initActionColumn();
    component.actions[7].onClick(component.selectedRows, 0);
    expect(component.actionQdn).toHaveBeenCalled();
  });

  it('initActionColumn QSIP', () => {
    spyOn(component, 'actionQsip');
    component.selectedRows = [rowData];
    component.initActionColumn();
    component.actions[8].onClick(component.selectedRows, 0);
    expect(component.actionQsip).toHaveBeenCalled();
  });

  it('warning dialog else situation', () => {
    component.warningDialog('action', []);
    expect(component.warningDialogData.title).toEqual('action 0 DN');
  });

  it('should call continueProcess', () => {
    spyOn(component, 'actionMaintencance');
    component.warningDialogData.data = [];
    component.continueProcess(true);
    expect(component.actionMaintencance).toHaveBeenCalled();
  });

  it('should call handleLinkClickDirectory', () => {
    const dataRow = { fieldName: 'cm_dn', rowData: rowData };
    spyOn(component, 'actionProperties');
    component.handleLinkClickDirectory(dataRow);
    expect(dataRow.fieldName).toBe(component.cols[1].field);
    expect(component.actionProperties).toHaveBeenCalled();
  });

  it('should call onCheckboxChange', () => {
    component.onCheckboxChange({ selectedRows: [] });
    expect(component.selectedAction).toBe(null);
  });

  it('should call dataTableChange', () => {
    component.dataTableChange([rowData]);
    expect(directoryService.dataTable.length).toBe(1);
  });

  it('should call refreshTable ', () => {
    spyOn(component.refreshDN, 'emit');
    directoryService.dataTable = [rowData];
    component.refreshTable();
    expect(component.refreshDN.emit).toHaveBeenCalled();
  });

  it('should call getRowsForAutoRefresh ', () => {
    spyOn(component.rbnTableDirectory.dataTable, 'dataToRender').and.returnValue([]);
    const rowsRefresh = component.getRowsForAutoRefresh();
    expect(rowsRefresh).toEqual([]);
  });
});
