import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DChannelMaintComponent } from './d-channel-maint.component';
import { TranslateInternalService } from 'src/app/services/translate-internal.service';
import { TranslateModule } from '@ngx-translate/core';
import { AppModule } from 'src/app/app.module';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { MaintGatewaysCarrierService } from 'src/app/modules/maint-gateways-carrier/services/maint-gateways-carrier.service';
import { StorageService } from 'src/app/services/storage.service';
import { of, throwError } from 'rxjs';
import { ECommandKey } from 'src/app/modules/maint-gateways-carrier/models/maint-gateways-carrier';

describe('DChannelMaintComponent', () => {
  let component: DChannelMaintComponent;
  let fixture: ComponentFixture<DChannelMaintComponent>;
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

  const errorResponseOfGenericCommandToPerformMaintenanceOrQuerying =
  {
    PostGroupDChannelByTrunkCLLI: {
      Header: {
        TrunkCLLI: 'G9ITISUPBA',
        CMCLLI: 'CO39',
        FirstMember: 450,
        TrunkMembers: 450,
        GroupSize: 450
      },
      Members: {
        Member: {
          TrunkMember: 450,
          Error: {
            Number: 137,
            Message: 'The trunk member is not data filled. Verify data fill in table TRKGRP/TRKSGRP/TRKMEM for C20.',
            Severity: 'MAJOR'
          }
        }
      }
    }
  };

  const successResponseOfGenericCommandToPerformMaintenanceOrQuerying =
  {
    PostGroupDChannelByTrunkCLLI: {
      Header: {
        TrunkCLLI: 'MARSPRA250N',
        CMCLLI: 'CO39'
      },
      Members: {
        Member: {
          TrunkDirection: '2W',
          TrunkSignaling: 'ISD ISD ',
          EndpointName: 'TDMs16c2f1/1/1/1/24',
          State: 'INS',
          GatewayName: 'CO39G9PRI',
          PMNumber: 2,
          NodeNumber: 42,
          TerminalNumber: 2096,
          PMType: 'GWC_NODE'
        }
      }
    }
  };

  const commonService = jasmine.createSpyObj('commonService', ['showAPIError', 'showErrorMessage']);

  const maintGatewaysCarrierService = jasmine.createSpyObj('maintGatewaysCarrierService', ['genericCommandToPerformMaintenanceOrQuerying']);

  const storageService = jasmine.createSpyObj('storageService', ['userID']);

  // const maintTrunkClliService = jasmine.createSpyObj('maintTrunkClliService', ['summaryDetails', 'handleTableData']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DChannelMaintComponent],
      imports: [AppModule, TranslateModule.forRoot()],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: TranslateInternalService, useValue: translate },
        { provide: CommonService, useValue: commonService },
        { provide: MaintGatewaysCarrierService, useValue: maintGatewaysCarrierService },
        { provide: StorageService, useValue: storageService }
        // { provide: MaintTrunkClliService, useValue: maintTrunkClliService}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DChannelMaintComponent);
    component = fixture.componentInstance;
    maintGatewaysCarrierService.genericCommandToPerformMaintenanceOrQuerying.and.returnValue(
      of(successResponseOfGenericCommandToPerformMaintenanceOrQuerying));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call hadnleRun', () => {
    spyOn(component, 'handleRun');
    const validTrunkClliName = 'MARSPRA250N';
    const validMaintanenceAction = 'PostGroupDChannelByTrunkCLLI';

    component.formGroup.controls['maintenanceAction'].setValue(validMaintanenceAction);
    component.trunkClliName = validTrunkClliName;

    component.handleRun();

    expect(component.handleRun).toHaveBeenCalledWith();
    expect(component.formGroup.value).toEqual({ maintenanceAction: 'PostGroupDChannelByTrunkCLLI', showDetails: false });
  });

  it('should call genericCommandToPerformMaintenanceOrQuerying with true parameters', () => {
    maintGatewaysCarrierService.genericCommandToPerformMaintenanceOrQuerying.and.returnValue(of(
      successResponseOfGenericCommandToPerformMaintenanceOrQuerying
    ));

    component.trunkClliName = 'MARSPRA250N';
    component.formGroup.controls['maintenanceAction'].setValue('PostGroupDChannelByTrunkCLLI');

    component.handleRun();

    expect(maintGatewaysCarrierService.genericCommandToPerformMaintenanceOrQuerying).toHaveBeenCalled();
  });

  it('should call genericCommandToPerformMaintenanceOrQuerying error', () => {
    maintGatewaysCarrierService.genericCommandToPerformMaintenanceOrQuerying.and.returnValue(throwError('error'));
    component.trunkClliName = 'MARSPRA250N';
    component.formGroup.controls['maintenanceAction'].setValue('PostGroupDChannelByTrunkCLLI');

    component.handleRun();
    expect(maintGatewaysCarrierService.genericCommandToPerformMaintenanceOrQuerying).toHaveBeenCalled();
    expect(commonService.showAPIError).toHaveBeenCalled();
  });

  it('should cancel when submit return false', () => {
    spyOn(component, 'handleCancel');
    component.onFormSubmit(false);
    expect(component.handleCancel).toHaveBeenCalled();
  });

  it('should call handleRun when submit returns true', () => {
    spyOn(component, 'handleRun');
    component.onFormSubmit(true);
    expect(component.handleRun).toHaveBeenCalled();
  });

  /* it('should show details when showDetails set true', () => {
    spyOn(component, 'showDetail');
    const sSecurityInfo = `UserID=${storageService.userID}`;
    component.formGroup.controls['showDetails'].setValue(true);
    component.trunkClliName = 'MARSPRA250N';
    component.formGroup.controls['maintenanceAction'].setValue('PostGroupDChannelByTrunkCLLI');
    const body: ITrunkMtcResourceInterface[] = [
      { key: ECommandKey.TrunkCLLI, value: component.trunkClliName }
    ];


    component.handleRun();

    expect(maintGatewaysCarrierService.genericCommandToPerformMaintenanceOrQuerying)
      .toHaveBeenCalledWith('PostGroupDChannelByTrunkCLLI', body, sSecurityInfo);
    expect(component.showDetail).toHaveBeenCalledWith(true);
  });*/
});
