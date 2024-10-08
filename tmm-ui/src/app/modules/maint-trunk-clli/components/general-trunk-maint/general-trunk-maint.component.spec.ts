import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralTrunkMaintComponent } from './general-trunk-maint.component';
import { TranslateInternalService } from 'src/app/services/translate-internal.service';
import { TranslateModule } from '@ngx-translate/core';
import { AppModule } from 'src/app/app.module';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { StorageService } from 'src/app/services/storage.service';
import { CommonService } from 'src/app/services/common.service';
import { MaintGatewaysCarrierService } from '../../../maint-gateways-carrier/services/maint-gateways-carrier.service';
import { of, throwError } from 'rxjs';

describe('GeneralTrunkMaintComponent', () => {
  let component: GeneralTrunkMaintComponent;
  let fixture: ComponentFixture<GeneralTrunkMaintComponent>;
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
        ANOTHER_SELECT_ITEM_IF_NEED: 'Another Select Item If Need',
        HEADER: {
          CARRIER_NAMES: 'Carrier Names',
          SUMMARY: 'Summary',
          COLUMNS: {
            State: 'State',
            TrunkDirection: 'Direction',
            TrunkSignaling: 'Signaling',
            EndpointName: 'Endpoint',
            GatewayName: 'Gateway',
            PMNumber: 'PM #',
            NodeNumber: 'Node #',
            TerminalNumber: 'Terminal #',
            PMType: 'PM Type',
            TrunkMember: 'Trunk Member',
            AdditionalInfo: 'Additional Info',
            CallID: 'Call Id',
            ContinuityCondition: 'Continuity Condition',
            TestResult: 'Test Result',
            ConnectedTo: 'Connected to',
            PMCarrier: 'Pm Carrier',
            PMTimeSlot: 'Time Slot',
            Error: 'Error'
          }
        }
      },
      MAI_GATE_WAYS_CARRIER: {
        HEADER: {
          COLUMNS: {
            STATE: 'State'
          }
        }
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
  const successResponseOfGenericCommandToPerformMaintenanceOrQuerying = {
    PostByTrunkCLLI: {
      Header: {
        TrunkCLLI: 'MARSPRA250N',
        CMCLLI: 'CO39',
        FirstMember: 1,
        TrunkMembers: '0-',
        GroupSize: 5
      },
      Members: {
        Member: [
          {
            TrunkMember: 1,
            TerminalNumber: 2073,
            TrunkDirection: '2W',
            TrunkSignaling: 'ISD ISD ',
            EndpointName: 'TDMs16c2f1/1/1/1/1',
            State: 'INB ',
            ConnectedTo: '                    ',
            PMTimeSlot: 1,
            PMCarrier: 0,
            GatewayName: 'CO39G9PRI',
            PMNumber: 2,
            NodeNumber: 42,
            PMType: 'GWC_NODE'
          }
        ]
      }
    }
  };

  const commonService = jasmine.createSpyObj('CommonService', ['showAPIError']);

  const maintTrunkService = jasmine.createSpyObj(
    'MaintGatewaysCarrierService',
    ['genericCommandToPerformMaintenanceOrQuerying']
  );

  const storageService = jasmine.createSpyObj('StorageService', ['userID']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GeneralTrunkMaintComponent],
      imports: [AppModule, TranslateModule.forRoot()],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: TranslateInternalService, useValue: translate },
        { provide: CommonService, useValue: commonService },
        {
          provide: MaintGatewaysCarrierService,
          useValue: maintTrunkService
        },
        { provide: StorageService, useValue: storageService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GeneralTrunkMaintComponent);
    component = fixture.componentInstance;
    maintTrunkService.genericCommandToPerformMaintenanceOrQuerying.and.returnValue(
      of(successResponseOfGenericCommandToPerformMaintenanceOrQuerying)
    );
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize properties and subscribe to value changes', () => {
    const selectedMaintenance = 'PostByTrunkCLLI';
    component.formGroup.get('maintenanceAction')?.setValue(selectedMaintenance);
    expect(component.currentActionItem).toBe(selectedMaintenance);
  });

  it('should get response genericCommandToPerformMaintenanceOrQuerying in handleRun()', () => {
    let securityInfoParam = '';
    const dataSubmit: any[] = [];
    const currentTrunkRangeValue = '0-';
    const currentActionItem = 'PostByTrunkCLLI';
    const trunkClliName = undefined;
    securityInfoParam = `UserID=${storageService.userID}`;
    dataSubmit.push(
      {
        key: 'TrunkClli',
        value: trunkClliName
      },
      {
        key: 'TrunkMembers',
        value: currentTrunkRangeValue
      }
    );
    component.handleRun();

    expect(
      maintTrunkService.genericCommandToPerformMaintenanceOrQuerying
    ).toHaveBeenCalledWith(currentActionItem, dataSubmit, securityInfoParam);
  });

  it('should call genericCommandToPerformMaintenanceOrQuerying error', () => {
    maintTrunkService.genericCommandToPerformMaintenanceOrQuerying.and.returnValue(
      throwError('error')
    );
    let securityInfoParam = '';
    const dataSubmit: any[] = [];
    const currentTrunkRangeValue = '0-';
    const currentActionItem = 'PostByTrunkCLLI';
    const trunkClliName = undefined;
    securityInfoParam = `UserID=${storageService.userID}`;
    dataSubmit.push(
      {
        key: 'TrunkClli',
        value: trunkClliName
      },
      {
        key: 'TrunkMembers',
        value: currentTrunkRangeValue
      }
    );
    component.handleRun();
    expect(
      maintTrunkService.genericCommandToPerformMaintenanceOrQuerying
    ).toHaveBeenCalledWith(currentActionItem, dataSubmit, securityInfoParam);
    expect(commonService.showAPIError).toHaveBeenCalled();
  });
});
