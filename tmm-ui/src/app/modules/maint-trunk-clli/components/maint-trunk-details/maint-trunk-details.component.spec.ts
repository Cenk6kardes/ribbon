import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintTrunkDetailsComponent } from './maint-trunk-details.component';
import { TranslateInternalService } from 'src/app/services/translate-internal.service';
import { CommonService } from 'src/app/services/common.service';
import { MaintGatewaysCarrierService } from 'src/app/modules/maint-gateways-carrier/services/maint-gateways-carrier.service';
import { StorageService } from 'src/app/services/storage.service';
import { of, throwError } from 'rxjs';
import { MaintTrunkClliService } from '../../services/maint-trunk-clli.service';
import { ITrunkMtcResourceInterface } from 'src/app/shared/models/trunk-mtc-resource-interface';

describe('MaiTrunkDetailsComponent', () => {
  let component: MaintTrunkDetailsComponent;
  let fixture: ComponentFixture<MaintTrunkDetailsComponent>;
  const translate = {
    translateResults: {
      TRUNK_CLLI: {
        TITLE: 'Maintenance by Trunk CLLI',
        GATEWAY_NAME: 'Gateway Name',
        TRUNK_CLLI: 'Trunk CLLI',
        GENERAL_TRUNK_MAINTANENCE: 'General Trunk Maintenance',
        D_CHANNEL_MAINTANENCE: 'D-Channel Maintenance',
        ISUP_COT_TEST: 'ISUP COT Test',
        TRUNK_RANGE: 'Trunk Range',
        MAINTANENCE_ACTION: 'Maintenance Action',
        TRUNK_MEMBER: 'Trunk Member',
        ANOTHER_SELECT_ITEM_IF_NEED: 'Another Select Item If Need'
      },
      COMMON: {
        RUN: 'Run',
        CANCEL: 'Cancel',
        ERROR: 'Error',
        SHOW_DETAILS: 'Show Details',
        SELECT: 'select',
        RUN_TEST: 'Run Test'
      }
    }
  };

  const tabOneSelectedRow = [
    {
      TrunkDirection: '2W',
      TrunkSignaling: 'ISD ISD ',
      EndpointName: 'TDMs16c2f1/1/1/1/24',
      State: 'INS ',
      GatewayName: 'CO39G9PRI',
      PMNumber: 2,
      NodeNumber: 42,
      TerminalNumber: 2096,
      PMType: 'GWC_NODE'
    }
  ];

  const tableZeroSelectedRow = [
    {
      TrunkMember: 1,
      TerminalNumber: 2073,
      TrunkDirection: '2W',
      TrunkSignaling: 'ISD ISD ',
      EndpointName: 'TDMs16c2f1/1/1/1/1',
      State: 'DMB ',
      ConnectedTo: '',
      PMTimeSlot: 1,
      PMCarrier: 0,
      GatewayName: 'CO39G9PRI',
      PMNumber: 2,
      NodeNumber: 42,
      PMType: 'GWC_NODE'

    }
  ];

  const errorResponse =
  {
    BSYByTrunkCLLI: {
      Header: {
        TrunkCLLI: 'G9ITISUPBA',
        CMCLLI: 'CO39',
        FirstMember: 450,
        TrunkMembers: 450,
        GroupSize: 450
      },
      Members: {
        Member: {
          Error: {
            Number: 137,
            Message: 'The trunk member is not data filled. Verify data fill in table TRKGRP/TRKSGRP/TRKMEM for C20.',
            Severity: 'MAJOR'
          }
        }
      }
    }
  };

  const succesResponse = {
    Header: {
      TrunkCLLI: 'MARSPRA250N',
      CMCLLI: 'CO39',
      FirstMember: 1,
      TrunkMembers: 1,
      GroupSize: 5
    },
    Members: ''
  };

  const commonService = jasmine.createSpyObj('commonService',
    ['showAPIError', 'showErrorMessage', 'getCurrentTime', 'showSuccessMessage']);

  const maintGatewaysCarrierService = jasmine.createSpyObj('maintGatewaysCarrierService', ['genericCommandToPerformMaintenanceOrQuerying']);

  const storageService = jasmine.createSpyObj('StorageService', ['userID']);

  const maintTrunkClliService = {
    ...jasmine.createSpyObj('MaintTrunkClliService',
      ['handleTableData', 'resetSummaryAndTable']),
    tableCols: of({}),
    summaryDetails: of('0-')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MaintTrunkDetailsComponent],
      providers: [
        { provide: TranslateInternalService, useValue: translate },
        { provide: CommonService, useValue: commonService },
        { provide: MaintTrunkClliService, useValue: maintTrunkClliService },
        { provide: MaintGatewaysCarrierService, useValue: maintGatewaysCarrierService },
        { provide: StorageService, useValue: storageService }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(MaintTrunkDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create', () => {
    spyOn(component, 'clearSelectedOption');
    const event = { selectedRows: [] };
    component.onCheckboxChange(event);
    expect(component.clearSelectedOption).toBeTruthy();
  });

  it('setTimeout clear Selected Option to be null', () => {
    jasmine.clock().install();
    component.clearSelectedOption();
    jasmine.clock().tick(500); // waits till 5000 milliseconds
    expect(component.selectedAction).toBe(null);
    jasmine.clock().uninstall(); // uninstall clock when done
  });

  it('should cols length 0 when tab index equal to 2 wihtout item ', () => {
    component.tabIndex = 2;
    component.checkTabIndex();
    expect(component.cols.length).toEqual(0);
  });

  it('should call callBulkActionApi when tabIndex equal to 1', () => {
    spyOn(component, 'callBulkActionApi');
    maintGatewaysCarrierService.genericCommandToPerformMaintenanceOrQuerying.and.returnValue(throwError('error'));
    component.tabIndex = 1;
    component.selectedRows = tabOneSelectedRow;
    const BSY_BY_TRUNKS = {
      label: 'Busy Trunks',
      value: 'BSYByTrunkCLLI'
    };

    component.callAction(BSY_BY_TRUNKS);
    expect(component.callBulkActionApi).toHaveBeenCalled();
  });

  it('should call callBulkActionApi when tabIndex equal to 0', () => {
    spyOn(component, 'callBulkActionApi');
    maintGatewaysCarrierService.genericCommandToPerformMaintenanceOrQuerying.and.returnValue(throwError('error'));
    component.tabIndex = 0;
    component.selectedRows = tableZeroSelectedRow;

    component.callAction('PostByTrunkCLLI');
    expect(component.callBulkActionApi).toHaveBeenCalled();
  });


  it('should call showApIError when genericCommandToPerformMaintenanceOrQuerying throw an error', () => {
    maintGatewaysCarrierService.genericCommandToPerformMaintenanceOrQuerying.and.returnValue(throwError('error'));

    component.tabIndex = 1;
    const body: ITrunkMtcResourceInterface[] = [
      { key: 'TerminalNumber', value: '2' },
      { key: 'NodeNumber', value: '2' },
      { key: 'Force', value: true }
    ];
    component.callBulkActionApi('BSYDChannelByTid', body, 'cmtg');

    expect(commonService.showAPIError).toHaveBeenCalled();
  });

  it('should call showApIError when genericCommandToPerformMaintenanceOrQuerying throw an error', () => {
    maintGatewaysCarrierService.genericCommandToPerformMaintenanceOrQuerying.and.returnValue(of(errorResponse));

    component.tabIndex = 1;
    const body: ITrunkMtcResourceInterface[] = [
      { key: 'TerminalNumber', value: '2' },
      { key: 'NodeNumber', value: '2' },
      { key: 'Force', value: true }
    ];
    component.callBulkActionApi('BSYByTrunkCLLI', body, 'cmtg');

    expect(commonService.showErrorMessage).toHaveBeenCalled();
  });

  it('should call handleTableData when genericCommandToPerformMaintenanceOrQuerying return success', () => {
    maintGatewaysCarrierService.genericCommandToPerformMaintenanceOrQuerying.and.returnValue(of(succesResponse));

    component.tabIndex = 1;
    const body: ITrunkMtcResourceInterface[] = [
      { key: 'TerminalNumber', value: '2' },
      { key: 'NodeNumber', value: '2' },
      { key: 'Force', value: true }
    ];
    component.callBulkActionApi('BSYByTrunkCLLI', body, 'cmtg');

    expect(maintGatewaysCarrierService.genericCommandToPerformMaintenanceOrQuerying).toHaveBeenCalled();
    expect(maintTrunkClliService.handleTableData).toHaveBeenCalled();
  });

  it('should call handleTableData when genericCommandToPerformMaintenanceOrQuerying return success', () => {
    maintGatewaysCarrierService.genericCommandToPerformMaintenanceOrQuerying.and.returnValue(of(succesResponse));

    component.tabIndex = 0;
    const body: ITrunkMtcResourceInterface[] = [
      { key: 'TrunkClli', value: 'MARSPRA250N' },
      { key: 'TrunkMembers', value: '1,2,3' }
    ];

    component.callBulkActionApi('BSYByTrunkCLLI', body, 'cmtg');

    expect(maintGatewaysCarrierService.genericCommandToPerformMaintenanceOrQuerying).toHaveBeenCalled();
    expect(maintTrunkClliService.handleTableData).toHaveBeenCalled();
  });

  it('Should call initActionColumn when tabIndex changed', () => {
    spyOn(component, 'initActionColumn');

    component.ngOnInit();
    component.tabIndex = 1;

    expect(component.initActionColumn).toHaveBeenCalled();
  });

});
